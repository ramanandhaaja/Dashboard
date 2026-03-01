import type { DEIAnalysis } from './azure-openai';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface PIIEntity {
  text: string;        // Original text (e.g., "John Smith")
  category: string;    // Entity type (e.g., "Person")
  placeholder: string; // Replacement (e.g., "[PERSON_1]")
  offset: number;
  length: number;
}

export interface RedactionResult {
  redactedText: string;
  entityMap: PIIEntity[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_CHARS_PER_DOC = 5120;
const MAX_DOCS_PER_BATCH = 5;
const REQUEST_TIMEOUT_MS = 3000;
const MIN_CONFIDENCE = 0.8;

// Categories to redact — skip Organization (needed for DE&I context)
const REDACT_CATEGORIES = new Set([
  'Person',
  // NOTE: 'PersonType' intentionally excluded — it matches generic words like
  // "chairman", "fireman", "guys", "wife", "kids", "clients", "candidate" etc.
  // which are needed for DE&I analysis (gendered terms, ableist language).
  'Email',
  'PhoneNumber',
  'Address',
  'CreditCardNumber',
  'BankAccountNumber',
  'InternationalBankingAccountNumber',
  'SocialSecurityNumber',
  'IPAddress',
  'DriversLicenseNumber',
  'PassportNumber',
  'TaxIdentificationNumber',
  'NationalIdentityNumber',
  'AUDriversLicenseNumber',
  'AUPassportNumber',
  'AUTaxFileNumber',
  'AUBusinessNumber',
  'AUCompanyNumber',
  'ATIdentityCard',
  'ATTaxIdentificationNumber',
  'ATValueAddedTaxNumber',
  'BEDriversLicenseNumber',
  'BENationalNumber',
  'BENationalNumberV2',
  'BEValueAddedTaxNumber',
  'DEDriversLicenseNumber',
  'DEIdentityCardNumber',
  'DEPassportNumber',
  'DETaxIdentificationNumber',
  'DEValueAddedTax',
  'EUDebitCardNumber',
  'EUDriversLicenseNumber',
  'EUGPSCoordinates',
  'EUNationalIdentificationNumber',
  'EUPassportNumber',
  'EUSocialSecurityNumber',
  'EUTaxIdentificationNumber',
  'FRDriversLicenseNumber',
  'FRHealthInsuranceNumber',
  'FRNationalIdCard',
  'FRPassportNumber',
  'FRSocialSecurityNumber',
  'FRTaxIdentificationNumber',
  'FRValueAddedTaxNumber',
  'NLCitizensServiceNumber',
  'NLCitizensServiceNumberV2',
  'NLDriversLicenseNumber',
  'NLPassportNumber',
  'NLTaxIdentificationNumber',
  'NLValueAddedTaxNumber',
  'UKDriversLicenseNumber',
  'UKElectoralRollNumber',
  'UKNationalHealthServiceNumber',
  'UKNationalInsuranceNumber',
  'UKUniqueTaxpayerReferenceNumber',
  'USBankAccountNumber',
  'USDriversLicenseNumber',
  'USIndividualTaxpayerIdentification',
  'USSocialSecurityNumber',
]);

// Map Azure category to placeholder prefix
function categoryToPrefix(category: string): string {
  if (category === 'Person') return 'PERSON';
  if (category === 'Email') return 'EMAIL';
  if (category === 'PhoneNumber') return 'PHONE';
  if (category === 'Address') return 'ADDRESS';
  // All ID-type categories
  return 'ID';
}

// Track whether we've logged the "disabled" message
let loggedDisabled = false;

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Redact PII from text using Azure AI Language.
 * Returns the redacted text and an entity map for later restoration.
 * On failure or missing config, returns original text unchanged.
 */
export async function redactPII(text: string): Promise<RedactionResult> {
  const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
  const key = process.env.AZURE_LANGUAGE_KEY;

  if (!endpoint || !key) {
    if (!loggedDisabled) {
      console.info('[pii-redaction] PII redaction disabled: AZURE_LANGUAGE_ENDPOINT or AZURE_LANGUAGE_KEY not configured');
      loggedDisabled = true;
    }
    return { redactedText: text, entityMap: [] };
  }

  try {
    // Split into chunks if needed
    const chunks = chunkText(text, MAX_CHARS_PER_DOC);

    // Process all chunks via Azure AI Language (batched up to 5 per request)
    const allEntities: PIIEntity[] = [];

    for (let batchStart = 0; batchStart < chunks.length; batchStart += MAX_DOCS_PER_BATCH) {
      const batch = chunks.slice(batchStart, batchStart + MAX_DOCS_PER_BATCH);
      const batchOffsets: number[] = [];

      // Calculate global offsets for each chunk in this batch
      let offset = 0;
      for (let i = 0; i < batchStart; i++) {
        offset += chunks[i].length;
      }
      for (const chunk of batch) {
        batchOffsets.push(offset);
        offset += chunk.length;
      }

      const documents = batch.map((chunk, idx) => ({
        id: String(idx + 1),
        language: '',  // Auto-detect language (supports Dutch, German, French, etc.)
        text: chunk,
      }));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(
          `${endpoint}/text/analytics/v3.1/entities/recognition/pii`,
          {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': key,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documents }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          console.warn(`[pii-redaction] Azure AI Language returned ${response.status}: ${response.statusText}`);
          return { redactedText: text, entityMap: [] };
        }

        const result = await response.json();

        // Extract entities from each document in the batch
        for (const doc of result.documents || []) {
          const docIndex = parseInt(doc.id, 10) - 1;
          const docOffset = batchOffsets[docIndex] || 0;

          for (const entity of doc.entities || []) {
            if (!REDACT_CATEGORIES.has(entity.category)) continue;
            if ((entity.confidenceScore || 0) < MIN_CONFIDENCE) continue;

            allEntities.push({
              text: entity.text,
              category: entity.category,
              placeholder: '', // assigned below
              offset: docOffset + entity.offset,
              length: entity.length,
            });
          }
        }
      } catch (err) {
        clearTimeout(timeout);
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn('[pii-redaction] Azure AI Language request timed out after 3s');
        } else {
          console.warn('[pii-redaction] Azure AI Language request failed:', err);
        }
        return { redactedText: text, entityMap: [] };
      }
    }

    if (allEntities.length === 0) {
      return { redactedText: text, entityMap: [] };
    }

    // Sort by offset descending so we can replace from end to start without shifting offsets
    allEntities.sort((a, b) => b.offset - a.offset);

    // Assign indexed placeholders per category prefix
    const prefixCounters = new Map<string, number>();
    // First pass: assign in document order (sort ascending temporarily)
    const entitiesAsc = [...allEntities].reverse();
    for (const entity of entitiesAsc) {
      const prefix = categoryToPrefix(entity.category);
      const count = (prefixCounters.get(prefix) || 0) + 1;
      prefixCounters.set(prefix, count);
      entity.placeholder = `[${prefix}_${count}]`;
    }

    // Build redacted text by replacing from end to start
    let redacted = text;
    for (const entity of allEntities) {
      redacted =
        redacted.slice(0, entity.offset) +
        entity.placeholder +
        redacted.slice(entity.offset + entity.length);
    }

    console.log(
      `[pii-redaction] Redacted ${allEntities.length} entities:`,
      [...prefixCounters.entries()].map(([k, v]) => `${v} ${k}`).join(', ')
    );

    return { redactedText: redacted, entityMap: entitiesAsc };
  } catch (err) {
    console.warn('[pii-redaction] Unexpected error:', err);
    return { redactedText: text, entityMap: [] };
  }
}

/**
 * Restore original text in DEI analysis results by replacing placeholders
 * with their original values from the entity map.
 *
 * Restores: OffendingText, SuggestedAlternative
 * Does NOT restore: IssueDetected, WhyItsProblematic
 */
export function restoreEntities(
  analysis: DEIAnalysis[],
  entityMap: PIIEntity[]
): DEIAnalysis[] {
  if (entityMap.length === 0) return analysis;

  return analysis.map((item) => ({
    ...item,
    OffendingText: restoreText(item.OffendingText, entityMap),
    SuggestedAlternative: restoreText(item.SuggestedAlternative, entityMap),
  }));
}

/**
 * Restore entities in bot DEI issues (same shape but different field usage).
 */
export function restoreBotEntities<T extends { OffendingText: string; SuggestedAlternative: string }>(
  issues: T[],
  entityMap: PIIEntity[]
): T[] {
  if (entityMap.length === 0) return issues;

  return issues.map((item) => ({
    ...item,
    OffendingText: restoreText(item.OffendingText, entityMap),
    SuggestedAlternative: restoreText(item.SuggestedAlternative, entityMap),
  }));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function restoreText(text: string, entityMap: PIIEntity[]): string {
  if (!text) return text;
  let result = text;
  for (const entity of entityMap) {
    result = result.replaceAll(entity.placeholder, entity.text);
  }
  return result;
}

/**
 * Split text into chunks of maxLen characters at sentence boundaries.
 */
function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find the last sentence boundary within maxLen
    const slice = remaining.slice(0, maxLen);
    // Look for sentence-ending punctuation followed by a space
    let splitAt = -1;
    for (let i = slice.length - 1; i >= Math.floor(maxLen * 0.5); i--) {
      if ((slice[i] === '.' || slice[i] === '!' || slice[i] === '?') &&
          (i + 1 >= slice.length || slice[i + 1] === ' ' || slice[i + 1] === '\n')) {
        splitAt = i + 1;
        break;
      }
    }

    // If no sentence boundary found, split at last space
    if (splitAt === -1) {
      splitAt = slice.lastIndexOf(' ');
    }

    // If still no good split point, force split at maxLen
    if (splitAt <= 0) {
      splitAt = maxLen;
    }

    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }

  return chunks;
}

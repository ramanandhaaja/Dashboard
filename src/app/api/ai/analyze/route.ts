import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { analyzeDEICompliance } from '@/lib/azure-openai'
import { handlePreflight, withCors } from '@/lib/cors'
import { redactPII, restoreEntities } from '@/lib/pii-redaction'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return withCors(authResult, request)

    // Parse body
    const body = await request.json()
    const { text, subject } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return withCors(
        NextResponse.json({ error: 'Text content is required' }, { status: 400 }),
        request
      )
    }

    // Combine text and subject if provided
    const fullText = subject
      ? `Subject: ${subject}\n\n${text}`
      : text

    // Redact PII before sending to LLM
    const { redactedText, entityMap } = await redactPII(fullText)

    console.log('[PII] ── Original text:', fullText)
    console.log('[PII] ── Redacted text (sent to LLM):', redactedText)
    console.log('[PII] ── Entity map:', entityMap.map(e => `${e.placeholder} → "${e.text}" (${e.category})`))

    const { analysis, usage } = await analyzeDEICompliance(redactedText)

    console.log('[PII] ── LLM OffendingText (before restore):', analysis.map(a => a.OffendingText))

    // Restore original text in OffendingText/SuggestedAlternative for client-side highlighting
    const restoredAnalysis = restoreEntities(analysis, entityMap)

    console.log('[PII] ── OffendingText (after restore):', restoredAnalysis.map(a => a.OffendingText))

    return withCors(NextResponse.json({ analysis: restoredAnalysis, usage }), request)
  } catch (error) {
    console.error('[API /ai/analyze] Error:', error)
    return withCors(
      NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 }),
      request
    )
  }
}

export async function OPTIONS(request: Request) {
  return handlePreflight(request)
}

import { NextResponse } from 'next/server'
import { validateBotSecret } from '@/lib/validate-bot-secret'
import { analyzeDEIComplianceForBot } from '@/lib/azure-openai'
import { redactPII, restoreBotEntities } from '@/lib/pii-redaction'

export async function POST(request: Request) {
  try {
    // Validate bot secret
    const authError = validateBotSecret(request)
    if (authError) return authError

    // Parse body
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    // Redact PII before sending to LLM
    const { redactedText, entityMap } = await redactPII(text)

    const result = await analyzeDEIComplianceForBot(redactedText)

    // Restore original text in OffendingText/SuggestedAlternative
    result.issues = restoreBotEntities(result.issues, entityMap)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API /ai/bot-analyze] Error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  })
}

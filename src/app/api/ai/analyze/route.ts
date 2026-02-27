import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { analyzeDEICompliance } from '@/lib/azure-openai'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return authResult

    // Parse body
    const body = await request.json()
    const { text, subject } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    // Combine text and subject if provided
    const fullText = subject
      ? `Subject: ${subject}\n\n${text}`
      : text

    const { analysis, usage } = await analyzeDEICompliance(fullText)

    return NextResponse.json({ analysis, usage })
  } catch (error) {
    console.error('[API /ai/analyze] Error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

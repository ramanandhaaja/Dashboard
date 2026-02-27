import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { analyzeDEICompliance } from '@/lib/azure-openai'
import { handlePreflight, withCors } from '@/lib/cors'

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

    const { analysis, usage } = await analyzeDEICompliance(fullText)

    return withCors(NextResponse.json({ analysis, usage }), request)
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

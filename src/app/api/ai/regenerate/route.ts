import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { regenerateSuggestions } from '@/lib/azure-openai'
import { handlePreflight, withCors } from '@/lib/cors'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return withCors(authResult, request)

    // Parse body
    const body = await request.json()
    const { offendingText, whyProblematic, previousSuggestions } = body

    if (!offendingText || typeof offendingText !== 'string') {
      return withCors(
        NextResponse.json({ error: 'offendingText is required' }, { status: 400 }),
        request
      )
    }

    const suggestions = await regenerateSuggestions(
      offendingText,
      whyProblematic || '',
      previousSuggestions || []
    )

    return withCors(NextResponse.json({ suggestions }), request)
  } catch (error) {
    console.error('[API /ai/regenerate] Error:', error)
    return withCors(
      NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 }),
      request
    )
  }
}

export async function OPTIONS(request: Request) {
  return handlePreflight(request)
}

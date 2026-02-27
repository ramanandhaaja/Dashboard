import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { regenerateSuggestions } from '@/lib/azure-openai'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return authResult

    // Parse body
    const body = await request.json()
    const { offendingText, whyProblematic, previousSuggestions } = body

    if (!offendingText || typeof offendingText !== 'string') {
      return NextResponse.json(
        { error: 'offendingText is required' },
        { status: 400 }
      )
    }

    const suggestions = await regenerateSuggestions(
      offendingText,
      whyProblematic || '',
      previousSuggestions || []
    )

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('[API /ai/regenerate] Error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

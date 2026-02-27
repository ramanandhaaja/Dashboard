import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { chatWithAssistant } from '@/lib/azure-openai'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return authResult

    // Parse body
    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await chatWithAssistant(message, history || [])

    return NextResponse.json({ response })
  } catch (error) {
    console.error('[API /ai/chat] Error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 502 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/validate-token'
import { chatWithAssistant } from '@/lib/azure-openai'
import { handlePreflight, withCors } from '@/lib/cors'

export async function POST(request: Request) {
  try {
    // Validate auth
    const authResult = await validateToken(request)
    if (authResult instanceof NextResponse) return withCors(authResult, request)

    // Parse body
    const body = await request.json()
    const { message, history } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return withCors(
        NextResponse.json({ error: 'Message is required' }, { status: 400 }),
        request
      )
    }

    const response = await chatWithAssistant(message, history || [])

    return withCors(NextResponse.json({ response }), request)
  } catch (error) {
    console.error('[API /ai/chat] Error:', error)
    return withCors(
      NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 502 }),
      request
    )
  }
}

export async function OPTIONS(request: Request) {
  return handlePreflight(request)
}

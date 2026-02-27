import { NextResponse } from 'next/server'

/**
 * Validate X-Bot-Secret header against BOT_API_SECRET env var.
 * Returns null on success, NextResponse error on failure.
 */
export function validateBotSecret(request: Request): NextResponse | null {
  const secret = request.headers.get('X-Bot-Secret')

  if (!secret) {
    return NextResponse.json(
      { error: 'Bot secret required' },
      { status: 401 }
    )
  }

  const expectedSecret = process.env.BOT_API_SECRET
  if (!expectedSecret) {
    console.error('[validate-bot-secret] BOT_API_SECRET env var not configured')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid bot secret' },
      { status: 401 }
    )
  }

  return null
}

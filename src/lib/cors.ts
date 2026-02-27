import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://localhost:3000',
  'https://lively-glacier-0c1d0f103.2.azurestaticapps.net',
]

/**
 * Get CORS headers for a request, checking the Origin against allowed origins.
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  const isAllowed = ALLOWED_ORIGINS.includes(origin)

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  }
}

/**
 * Handle CORS preflight OPTIONS request.
 */
export function handlePreflight(request: Request): NextResponse {
  const headers = getCorsHeaders(request)
  return new NextResponse(null, { status: 204, headers })
}

/**
 * Add CORS headers to a NextResponse.
 */
export function withCors(response: NextResponse, request: Request): NextResponse {
  const headers = getCorsHeaders(request)
  for (const [key, value] of Object.entries(headers)) {
    if (value) response.headers.set(key, value)
  }
  return response
}

/**
 * Fetch a ChatKit client secret from the session endpoint
 * This is used by the ChatKit React SDK to authenticate chat sessions
 */
export async function getChatKitClientSecret(): Promise<string> {
  const response = await fetch('/api/chatkit/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Failed to create session'
    }))
    throw new Error(errorData.error || 'Failed to get ChatKit client secret')
  }

  const data = await response.json()
  return data.client_secret
}

interface HealthResponse {
  status: string
  timestamp: string
  userId: string
}

interface ApiError {
  error: string
  message: string
}

export async function checkApiHealth(): Promise<HealthResponse> {
  // Use secure server-side proxy endpoint
  const response = await fetch('/api/health', {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    const errorData: ApiError = await response.json()
    throw new Error(errorData.error || "Failed to check API health")
  }

  return response.json()
}
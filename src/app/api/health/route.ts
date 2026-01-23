import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Validate session server-side
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get the raw NextAuth token for backend API calls
    const rawToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true
    })

    if (!rawToken) {
      return NextResponse.json(
        { error: "Unable to authenticate" },
        { status: 401 }
      )
    }

    // Make the health check request server-side to Fastify API
    const healthResponse = await fetch(`${process.env.API_BASE_URL || "http://localhost:3033/api"}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${rawToken}`,
      },
    })

    if (!healthResponse.ok) {
      const errorData = await healthResponse.json()
      return NextResponse.json(
        { error: errorData.message || "Health check failed" },
        { status: healthResponse.status }
      )
    }

    const healthData = await healthResponse.json()

    // Return only safe, filtered data
    return NextResponse.json({
      status: healthData.status,
      timestamp: healthData.timestamp,
      userId: healthData.userId
    })

  } catch {
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    )
  }
}
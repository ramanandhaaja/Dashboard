import { NextResponse } from "next/server"

export async function POST() {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      console.error("Missing OPENAI_API_KEY environment variable")
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable" },
        { status: 500 }
      )
    }

    const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID

    if (!workflowId) {
      console.error("Missing NEXT_PUBLIC_CHATKIT_WORKFLOW_ID environment variable")
      return NextResponse.json(
        { error: "Missing workflow id" },
        { status: 400 }
      )
    }

    console.log("Creating ChatKit session...")
    console.log("Using workflow ID:", workflowId)

    // Call OpenAI ChatKit sessions endpoint
    const apiBase = process.env.CHATKIT_API_BASE || "https://api.openai.com"
    const url = `${apiBase}/v1/chatkit/sessions`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "OpenAI-Beta": "chatkit_beta=v1",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error:", response.status, errorText)
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { message: errorText } }
      }
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to create ChatKit session" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("ChatKit session created successfully")

    return NextResponse.json(data)

  } catch (error) {
    console.error("ChatKit session error:", error)
    return NextResponse.json(
      { error: "Failed to create ChatKit session" },
      { status: 500 }
    )
  }
}

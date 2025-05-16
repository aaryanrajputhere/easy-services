import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // Try to list blobs (this will fail if the token is invalid)
    const blobs = await list()

    return NextResponse.json({
      success: true,
      message: "Blob integration is working correctly",
      blobCount: blobs.blobs.length,
    })
  } catch (error) {
    console.error("Error testing Blob:", error)

    // Check if the error is related to missing or invalid token
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const isTokenError = errorMessage.includes("token") || errorMessage.includes("unauthorized")

    return NextResponse.json(
      {
        success: false,
        message: "Blob integration test failed",
        isTokenError,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

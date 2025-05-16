import { NextResponse } from "next/server"

// Simplified version that doesn't use Vercel Blob directly
export async function GET() {
  try {
    // Check if Blob token is available without trying to use it
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

    return NextResponse.json({
      success: true,
      message: "API route is working",
      hasBlobToken,
      environment: process.env.NODE_ENV || "unknown",
    })
  } catch (error) {
    console.error("Error in test route:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

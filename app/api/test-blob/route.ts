import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export async function GET() {
  try {
    // Check if Blob token is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "BLOB_READ_WRITE_TOKEN is not set",
        },
        { status: 500 },
      )
    }

    // Try to list blobs to test the connection
    const blobs = await list()

    return NextResponse.json({
      success: true,
      message: "Blob connection is working correctly",
      blobCount: blobs.blobs.length,
      domain: process.env.VERCEL_URL || "unknown",
    })
  } catch (error) {
    console.error("Error testing Blob:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

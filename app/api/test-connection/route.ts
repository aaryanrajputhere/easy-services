import { NextResponse } from "next/server"

// This route is used to test if the API routes are working correctly
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API routes are working correctly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    // Check if Blob token is available (don't expose the actual token)
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  })
}

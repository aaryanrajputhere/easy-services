import { NextResponse } from "next/server"

export async function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  return NextResponse.json({
    hasBlobToken: !!blobToken,
    tokenFirstChars: blobToken ? `${blobToken.substring(0, 5)}...` : null,
    // Don't show the full token for security reasons
  })
}

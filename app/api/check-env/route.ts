import { NextResponse } from "next/server"

export async function GET() {
  // Check for environment variables
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const resendApiKey = process.env.RESEND_API_KEY

  return NextResponse.json({
    hasBlobToken: !!blobToken,
    hasResendApiKey: !!resendApiKey,
    // Add first few characters of tokens for verification (if they exist)
    tokenFirstChars: blobToken ? `${blobToken.substring(0, 5)}...` : null,
    resendApiKeyPrefix: resendApiKey ? `${resendApiKey.substring(0, 5)}...` : null,
    // Don't show the full token for security reasons
  })
}

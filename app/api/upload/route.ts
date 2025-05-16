import { NextResponse } from "next/server"

// Simplified version that doesn't use Vercel Blob directly
export async function POST(request: Request) {
  try {
    // Log that we're starting the upload process
    console.log("Starting document upload process")

    // Parse the form data
    const formData = await request.formData()

    // Get the file from the form data
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      console.error("No valid file provided in the request")
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)

    // Instead of using Vercel Blob, just return a simulated success response
    // This helps us determine if the error is with Vercel Blob specifically
    const simulatedUrl = `https://example.com/uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    console.log(`Simulated upload URL: ${simulatedUrl}`)

    // Return success response
    return NextResponse.json({
      success: true,
      url: simulatedUrl,
      name: file.name,
    })
  } catch (error) {
    // Log the full error
    console.error("Error in upload handler:", error)

    // Return detailed error response
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

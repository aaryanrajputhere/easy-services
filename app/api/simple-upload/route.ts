import { NextResponse } from "next/server"

// This is a simplified upload handler that doesn't depend on Vercel Blob
// It simulates a successful upload for testing purposes
export async function POST(request: Request) {
  try {
    // Log the request headers to help diagnose issues
    console.log("Upload request headers:", Object.fromEntries(request.headers.entries()))

    // Parse the form data
    const formData = await request.formData()
    console.log(
      "Form data received, entries:",
      [...formData.entries()].map((e) => e[0]),
    )

    // Get the file
    const file = formData.get("file")

    // Check if file exists and is a File object
    if (!file || !(file instanceof File)) {
      console.error("No valid file in request:", file)
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 })
    }

    // Log file details
    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)

    // Generate a fake URL that looks like a real file URL
    // In a real implementation, you would upload to a storage service
    const fakeUrl = `https://storage.googleapis.com/fake-bucket/${Date.now()}-${encodeURIComponent(file.name)}`

    // Return success response
    return NextResponse.json({
      success: true,
      url: fakeUrl,
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
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}

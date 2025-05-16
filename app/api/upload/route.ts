import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

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

    // Generate a unique filename to prevent collisions
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Vercel Blob
    console.log(`Uploading file to Vercel Blob: ${uniqueFilename}`)

    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN is not set")
      return NextResponse.json({ error: "Blob storage is not properly configured" }, { status: 500 })
    }

    const blob = await put(uniqueFilename, file, {
      access: "public",
      addRandomSuffix: false, // We're already adding a timestamp
    })

    console.log(`File uploaded successfully: ${blob.url}`)

    // Return success response
    return NextResponse.json({
      success: true,
      url: blob.url,
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

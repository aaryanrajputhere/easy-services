import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("No file provided in the request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log(`Attempting to upload file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`)

    // Generate a unique filename to prevent collisions
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${file.name.replace(/\s+/g, "-")}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    console.log(`File uploaded successfully: ${blob.url}`)

    return NextResponse.json({
      success: true,
      url: blob.url,
      name: file.name,
    })
  } catch (error) {
    console.error("Error uploading file:", error)

    // Detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { generateTestImage } from "@/lib/diagnostics-utils"

// This route will create test images in the public/images directory
export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not set" }, { status: 500 })
    }

    // Define the test images to create
    const testImages = [
      { name: "business-funding.jpg", width: 800, height: 600, text: "Business Funding" },
      { name: "business-owner.jpg", width: 800, height: 600, text: "Business Owner" },
      { name: "funding-process.jpg", width: 800, height: 600, text: "Funding Process" },
    ]

    const results = []

    // Generate and upload each test image
    for (const img of testImages) {
      try {
        // Generate a test image
        const blob = await generateTestImage(img.width, img.height, img.text)

        // Create a File object from the blob
        const file = new File([blob], img.name, { type: "image/png" })

        // Upload to Vercel Blob
        const result = await put(`images/${img.name}`, file, {
          access: "public",
        })

        results.push({
          name: img.name,
          url: result.url,
          success: true,
        })

        console.log(`Created test image: ${img.name} at ${result.url}`)
      } catch (error) {
        console.error(`Error creating test image ${img.name}:`, error)
        results.push({
          name: img.name,
          error: error instanceof Error ? error.message : "Unknown error",
          success: false,
        })
      }
    }

    return NextResponse.json({
      message: "Test images created",
      images: results,
    })
  } catch (error) {
    console.error("Error in generate-test-images route:", error)
    return NextResponse.json(
      { error: "Failed to create test images", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

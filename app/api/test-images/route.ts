import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// This route will create test images in your Blob storage
export async function GET() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not set" }, { status: 500 })
    }

    const testImages = [
      {
        name: "business-funding.jpg",
        url: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1000",
      },
      {
        name: "business-owner.jpg",
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000",
      },
      {
        name: "funding-process.jpg",
        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000",
      },
    ]

    const results = []

    for (const image of testImages) {
      try {
        // Fetch the image from Unsplash
        const response = await fetch(image.url)
        if (!response.ok) throw new Error(`Failed to fetch image: ${image.url}`)

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Vercel Blob
        const blob = await put(`test-${image.name}`, buffer, {
          access: "public",
        })

        results.push({
          name: image.name,
          url: blob.url,
          success: true,
        })

        console.log(`Created test image: ${image.name} at ${blob.url}`)
      } catch (error) {
        console.error(`Error creating test image ${image.name}:`, error)
        results.push({
          name: image.name,
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
    console.error("Error in test-images route:", error)
    return NextResponse.json(
      { error: "Failed to create test images", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

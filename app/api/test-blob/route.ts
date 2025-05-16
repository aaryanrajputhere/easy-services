import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    // Create a simple test image
    const canvas = new OffscreenCanvas(200, 200)
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Failed to get canvas context")
    }

    // Draw a simple test pattern
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = "#4ade80"
    ctx.fillRect(50, 50, 100, 100)
    ctx.fillStyle = "#000000"
    ctx.font = "16px Arial"
    ctx.fillText("Test Image", 60, 100)
    ctx.fillText(new Date().toISOString(), 60, 120)

    // Convert to blob
    const blob = await canvas.convertToBlob({ type: "image/png" })

    // Create a File object from the blob
    const file = new File([blob], "test-image.png", { type: "image/png" })

    // Upload to Vercel Blob
    const result = await put(`test-image-${Date.now()}.png`, file, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      message: "Test image created and uploaded successfully",
    })
  } catch (error) {
    console.error("Error in test-blob route:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

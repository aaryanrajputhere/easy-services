import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { checkUrlAccessibility, generateTestImage, formatBytes } from "@/lib/diagnostics-utils"

// Standard test image paths to check
const TEST_IMAGE_PATHS = [
  "/images/business-funding.jpg",
  "/images/business-owner.jpg",
  "/images/funding-process.jpg",
  "/placeholder.svg",
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action") || "check"

  try {
    // Check environment variables
    const envCheck = {
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    }

    // Basic system info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
    }

    // Check image paths
    if (action === "check-images") {
      const results = await Promise.all(
        TEST_IMAGE_PATHS.map(async (path) => {
          // For relative paths, convert to absolute URL
          const isRelative = path.startsWith("/")
          const baseUrl = new URL(request.url).origin
          const fullUrl = isRelative ? `${baseUrl}${path}` : path

          const result = await checkUrlAccessibility(fullUrl)

          return {
            path,
            fullUrl,
            ...result,
          }
        }),
      )

      return NextResponse.json({
        action: "check-images",
        results,
        systemInfo,
        envCheck,
      })
    }

    // Create test images in Blob storage
    if (action === "create-test-images") {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          {
            error: "BLOB_READ_WRITE_TOKEN is not set",
            systemInfo,
            envCheck,
          },
          { status: 500 },
        )
      }

      const testImages = [
        { name: "test-business-funding.jpg", width: 800, height: 600, text: "Business Funding" },
        { name: "test-business-owner.jpg", width: 800, height: 600, text: "Business Owner" },
        { name: "test-funding-process.jpg", width: 800, height: 600, text: "Funding Process" },
      ]

      const results = await Promise.all(
        testImages.map(async (img) => {
          try {
            // Generate a test image
            const blob = await generateTestImage(img.width, img.height, img.text)

            // Create a File object from the blob
            const file = new File([blob], img.name, { type: "image/png" })

            // Upload to Vercel Blob
            const result = await put(`images/${img.name}`, file, {
              access: "public",
            })

            return {
              name: img.name,
              url: result.url,
              size: formatBytes(file.size),
              success: true,
            }
          } catch (error) {
            console.error(`Error creating test image ${img.name}:`, error)
            return {
              name: img.name,
              error: error instanceof Error ? error.message : "Unknown error",
              success: false,
            }
          }
        }),
      )

      return NextResponse.json({
        action: "create-test-images",
        results,
        systemInfo,
        envCheck,
      })
    }

    // Test upload functionality
    if (action === "test-upload") {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          {
            error: "BLOB_READ_WRITE_TOKEN is not set",
            systemInfo,
            envCheck,
          },
          { status: 500 },
        )
      }

      // Generate a test document
      const testDoc = await generateTestImage(800, 1000, "Test Document", "#ffffff", "#000000")
      const file = new File([testDoc], "test-document.pdf", { type: "application/pdf" })

      // Upload to Vercel Blob
      const result = await put(`documents/test-document-${Date.now()}.pdf`, file, {
        access: "public",
      })

      return NextResponse.json({
        action: "test-upload",
        result: {
          name: file.name,
          url: result.url,
          size: formatBytes(file.size),
          success: true,
        },
        systemInfo,
        envCheck,
      })
    }

    // Default action - return system status
    return NextResponse.json({
      status: "ok",
      systemInfo,
      envCheck,
      availableActions: ["check-images", "create-test-images", "test-upload"],
    })
  } catch (error) {
    console.error("Error in diagnostics route:", error)

    return NextResponse.json(
      {
        error: "Diagnostics failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * Utility functions for diagnosing image and file upload issues
 */

// Check if a URL is accessible
export async function checkUrlAccessibility(url: string): Promise<{
  accessible: boolean
  status?: number
  error?: string
  headers?: Record<string, string>
}> {
  try {
    // Add cache-busting parameter to avoid cached responses
    const testUrl = url.includes("?") ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`

    const response = await fetch(testUrl, {
      method: "HEAD",
      cache: "no-store",
    })

    // Get response headers
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      accessible: response.ok,
      status: response.status,
      headers,
    }
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Get file extension from a URL or path
export function getFileExtension(path: string): string {
  const filename = path.split("/").pop() || ""
  return filename.includes(".") ? filename.split(".").pop()?.toLowerCase() || "" : ""
}

// Check if a file is an image based on extension
export function isImageFile(path: string): boolean {
  const extension = getFileExtension(path)
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(extension)
}

// Format bytes to human-readable size
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// Generate a test image using canvas
export function generateTestImage(
  width = 300,
  height = 200,
  text = "Test Image",
  bgColor = "#f0f0f0",
  textColor = "#333333",
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Failed to get canvas context")
    }

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // Add border
    ctx.strokeStyle = "#999999"
    ctx.lineWidth = 2
    ctx.strokeRect(5, 5, width - 10, height - 10)

    // Add text
    ctx.fillStyle = textColor
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, width / 2, height / 2)

    // Add timestamp
    ctx.font = "12px Arial"
    ctx.fillText(new Date().toISOString(), width / 2, height / 2 + 30)

    // Convert to blob
    canvas.convertToBlob({ type: "image/png" }).then(resolve)
  })
}

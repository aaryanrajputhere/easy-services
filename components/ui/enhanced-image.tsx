"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Info } from "lucide-react"

interface EnhancedImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
  showDebugInfo?: boolean
}

export function EnhancedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className = "",
  width,
  height,
  showDebugInfo = false,
}: EnhancedImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Generate a placeholder URL with dimensions and text
  const getPlaceholder = () => {
    const w = width || 300
    const h = height || 200
    const text = encodeURIComponent(alt || "Image")
    return `/placeholder.svg?height=${h}&width=${w}&text=${text}`
  }

  // Check if the image exists before setting it
  useEffect(() => {
    const checkImage = async () => {
      if (!src) {
        setImgSrc(fallbackSrc || getPlaceholder())
        setLoading(false)
        setError("No source URL provided")
        return
      }

      try {
        // Add a cache-busting parameter to avoid browser caching
        const testSrc = `${src}?t=${Date.now()}`

        // First try a HEAD request to check if the image exists
        const response = await fetch(testSrc, {
          method: "HEAD",
          cache: "no-store",
        })

        // Collect debug information
        const debugData = {
          url: src,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString(),
        }

        setDebugInfo(debugData)

        if (response.ok) {
          setImgSrc(src)
          setError(null)
        } else {
          console.warn(`Image not found: ${src} (Status: ${response.status})`)
          setImgSrc(fallbackSrc || getPlaceholder())
          setError(`Failed to load image (Status: ${response.status})`)
        }
      } catch (err) {
        console.error(`Error checking image: ${src}`, err)
        setImgSrc(fallbackSrc || getPlaceholder())
        setError(err instanceof Error ? err.message : "Unknown error")

        setDebugInfo({
          url: src,
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    checkImage()
  }, [src, fallbackSrc, alt, width, height])

  const handleError = () => {
    console.warn(`Error loading image: ${imgSrc}`)
    setImgSrc(fallbackSrc || getPlaceholder())
    setError(`Failed to load image in browser`)
  }

  if (loading) {
    return (
      <div
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "100%" }}
      />
    )
  }

  return (
    <div className="relative">
      <img
        src={imgSrc || getPlaceholder()}
        alt={alt}
        onError={handleError}
        className={className}
        width={width}
        height={height}
      />

      {error && (
        <div className="absolute bottom-2 right-2 bg-red-100 text-red-800 text-xs p-1 rounded flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span>{error}</span>
          {showDebugInfo && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="ml-1 p-0.5 hover:bg-red-200 rounded"
              aria-label="Toggle debug info"
            >
              <Info className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {showDebugInfo && showDetails && debugInfo && (
        <div className="absolute top-0 left-0 right-0 bg-black/80 text-white text-xs p-2 overflow-auto max-h-40">
          <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

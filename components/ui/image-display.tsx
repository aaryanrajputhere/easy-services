"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

interface ImageDisplayProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
}

export function ImageDisplay({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className = "",
  width,
  height,
}: ImageDisplayProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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
        return
      }

      try {
        // Add a cache-busting parameter to avoid browser caching
        const testSrc = `${src}?t=${Date.now()}`
        const response = await fetch(testSrc, { method: "HEAD" })

        if (response.ok) {
          setImgSrc(src)
          setError(false)
        } else {
          console.warn(`Image not found: ${src}`)
          setImgSrc(fallbackSrc || getPlaceholder())
          setError(true)
        }
      } catch (err) {
        console.error(`Error checking image: ${src}`, err)
        setImgSrc(fallbackSrc || getPlaceholder())
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    checkImage()
  }, [src, fallbackSrc, alt, width, height])

  const handleError = () => {
    console.warn(`Error loading image: ${imgSrc}`)
    setImgSrc(fallbackSrc || getPlaceholder())
    setError(true)
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
          <span>Image error</span>
        </div>
      )}
    </div>
  )
}

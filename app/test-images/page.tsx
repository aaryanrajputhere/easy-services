"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedImage } from "@/components/ui/enhanced-image"
import Link from "next/link"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function TestImagesPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const testImagePaths = ["/images/business-funding.jpg", "/images/business-owner.jpg", "/images/funding-process.jpg"]

  const generateTestImages = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-test-images")

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      setGeneratedImages(data.images || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error generating test images")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Images</h1>
        <div className="flex gap-2">
          <Link href="/advanced-diagnostics">
            <Button variant="outline">Advanced Diagnostics</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testImagePaths.map((path, index) => (
              <div key={index} className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">{path.split("/").pop()}</h3>
                <EnhancedImage
                  src={path}
                  alt={`Test image ${index + 1}`}
                  className="w-full h-auto"
                  showDebugInfo={true}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button onClick={generateTestImages} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Test Images...
                </>
              ) : (
                "Generate New Test Images"
              )}
            </Button>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Test Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{image.name}</h3>
                    {image.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>

                  {image.success ? (
                    <EnhancedImage src={image.url} alt={image.name} className="w-full h-auto" showDebugInfo={true} />
                  ) : (
                    <div className="bg-red-50 text-red-800 p-4 rounded-md">
                      <p>Failed to generate image: {image.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                These images have been generated and stored in Vercel Blob storage. You can use them in your application
                by updating your code to reference these URLs.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

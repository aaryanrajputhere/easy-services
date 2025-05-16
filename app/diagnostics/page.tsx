"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DiagnosticsPage() {
  const [blobStatus, setBlobStatus] = useState<"loading" | "success" | "error">("loading")
  const [blobError, setBlobError] = useState<string | null>(null)
  const [imageStatus, setImageStatus] = useState<"loading" | "success" | "error">("loading")
  const [imageError, setImageError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{ [key: string]: boolean }>({})
  const [testImageUrl, setTestImageUrl] = useState<string | null>(null)

  // Test Blob Storage
  const testBlobStorage = async () => {
    setBlobStatus("loading")
    setBlobError(null)

    try {
      const response = await fetch("/api/test-blob")
      const data = await response.json()

      if (response.ok && data.success) {
        setBlobStatus("success")
        setTestImageUrl(data.url)
      } else {
        setBlobStatus("error")
        setBlobError(data.error || "Unknown error testing Blob storage")
      }
    } catch (error) {
      setBlobStatus("error")
      setBlobError(error instanceof Error ? error.message : "Unknown error testing Blob storage")
    }
  }

  // Test Image Loading
  const testImageLoading = () => {
    setImageStatus("loading")
    setImageError(null)

    const testImages = ["/images/business-funding.jpg", "/images/business-owner.jpg", "/images/funding-process.jpg"]

    const imagePromises = testImages.map((src) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })
    })

    Promise.all(imagePromises)
      .then(() => {
        setImageStatus("success")
      })
      .catch((error) => {
        setImageStatus("error")
        setImageError(error.message)
      })
  }

  // Check Environment Variables
  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch("/api/check-env")
      const data = await response.json()
      setEnvVars(data)
    } catch (error) {
      console.error("Error checking environment variables:", error)
    }
  }

  useEffect(() => {
    testBlobStorage()
    testImageLoading()
    checkEnvironmentVariables()
  }, [])

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Website Diagnostics</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blob Storage Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {blobStatus === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            ) : blobStatus === "success" ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>Blob storage is working correctly</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2 h-5 w-5" />
                <span>Blob storage error: {blobError}</span>
              </div>
            )}
            <Button onClick={testBlobStorage} size="sm">
              Test Again
            </Button>
          </div>

          {testImageUrl && (
            <div className="mt-4">
              <p className="text-sm mb-2">Test image uploaded to Blob storage:</p>
              <div className="border rounded p-2 max-w-xs">
                <img src={testImageUrl || "/placeholder.svg"} alt="Test Blob" className="max-w-full h-auto" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Loading Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {imageStatus === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            ) : imageStatus === "success" ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>All images loaded successfully</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2 h-5 w-5" />
                <span>Image loading error: {imageError}</span>
              </div>
            )}
            <Button onClick={testImageLoading} size="sm">
              Test Again
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="border rounded p-2">
              <img src="/images/business-funding.jpg" alt="Business Funding" className="max-w-full h-auto" />
            </div>
            <div className="border rounded p-2">
              <img src="/images/business-owner.jpg" alt="Business Owner" className="max-w-full h-auto" />
            </div>
            <div className="border rounded p-2">
              <img src="/images/funding-process.jpg" alt="Funding Process" className="max-w-full h-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-64 font-medium">BLOB_READ_WRITE_TOKEN:</span>
              {envVars.hasBlobToken ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Available</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="mr-2 h-5 w-5" />
                  <span>Missing</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <span className="w-64 font-medium">RESEND_API_KEY:</span>
              {envVars.hasResendApiKey ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>Available</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="mr-2 h-5 w-5" />
                  <span>Missing</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">If Blob Storage Test Failed:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Check that your BLOB_READ_WRITE_TOKEN is set correctly in your environment variables</li>
                  <li>Verify that your Blob store is properly configured in your Vercel project</li>
                  <li>Check the Vercel logs for any errors related to Blob storage</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">If Image Loading Test Failed:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Verify that the image files exist in the public/images directory</li>
                  <li>Check that the image paths are correct in your code</li>
                  <li>Ensure that the images are properly deployed to your Vercel project</li>
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/apply">
                <Button>Test Application Form</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, AlertCircle, Upload, Loader2 } from "lucide-react"
import Link from "next/link"
import { ImageDisplay } from "@/components/ui/image-display"
import { Progress } from "@/components/ui/progress"

export default function DiagnosticsPage() {
  const [blobStatus, setBlobStatus] = useState<"loading" | "success" | "error">("loading")
  const [blobError, setBlobError] = useState<string | null>(null)
  const [imageStatus, setImageStatus] = useState<"loading" | "success" | "error">("loading")
  const [imageError, setImageError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{ [key: string]: boolean }>({})
  const [testImageUrl, setTestImageUrl] = useState<string | null>(null)
  const [testImages, setTestImages] = useState<any[]>([])
  const [isCreatingTestImages, setIsCreatingTestImages] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  // Create Test Images
  const createTestImages = async () => {
    setIsCreatingTestImages(true)

    try {
      const response = await fetch("/api/test-images")
      const data = await response.json()

      if (response.ok) {
        setTestImages(data.images || [])
        setImageStatus("success")
      } else {
        setImageStatus("error")
        setImageError(data.error || "Unknown error creating test images")
      }
    } catch (error) {
      setImageStatus("error")
      setImageError(error instanceof Error ? error.message : "Unknown error creating test images")
    } finally {
      setIsCreatingTestImages(false)
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

  // Test File Upload
  const testFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploadStatus("uploading")
    setUploadError(null)
    setUploadProgress(0)

    // Create form data
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadStatus("success")
        setUploadedFileUrl(data.url)
      } else {
        setUploadStatus("error")
        setUploadError(data.error || data.message || "Unknown error uploading file")
      }
    } catch (error) {
      setUploadStatus("error")
      setUploadError(error instanceof Error ? error.message : "Unknown error uploading file")
    }
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
            <Button onClick={createTestImages} size="sm" disabled={isCreatingTestImages}>
              {isCreatingTestImages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Test Images"
              )}
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="border rounded p-2">
              <ImageDisplay
                src="/images/business-funding.jpg"
                alt="Business Funding"
                className="max-w-full h-auto"
                width={200}
                height={150}
              />
            </div>
            <div className="border rounded p-2">
              <ImageDisplay
                src="/images/business-owner.jpg"
                alt="Business Owner"
                className="max-w-full h-auto"
                width={200}
                height={150}
              />
            </div>
            <div className="border rounded p-2">
              <ImageDisplay
                src="/images/funding-process.jpg"
                alt="Funding Process"
                className="max-w-full h-auto"
                width={200}
                height={150}
              />
            </div>
          </div>

          {testImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Test Images Created:</h3>
              <div className="grid grid-cols-3 gap-4">
                {testImages.map((image, index) => (
                  <div key={index} className="border rounded p-2">
                    {image.success ? (
                      <>
                        <img src={image.url || "/placeholder.svg"} alt={image.name} className="max-w-full h-auto" />
                        <p className="text-xs mt-1 truncate">{image.name}</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[150px] bg-red-50 text-red-500">
                        <XCircle className="h-8 w-8 mb-2" />
                        <p className="text-xs text-center">Failed to create {image.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="mb-2 text-sm text-muted-foreground">Select a file to test the upload functionality</p>
              <Input type="file" className="hidden" id="test-file-upload" onChange={testFileUpload} />
              <label htmlFor="test-file-upload">
                <Button type="button" variant="outline" className="mt-2">
                  Select File
                </Button>
              </label>
            </div>

            {uploadStatus !== "idle" && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Upload Status:</span>
                  {uploadStatus === "uploading" ? (
                    <div className="flex items-center text-blue-600">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : uploadStatus === "success" ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Upload successful</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>Upload failed: {uploadError}</span>
                    </div>
                  )}
                </div>

                {uploadStatus === "uploading" && <Progress value={uploadProgress} className="h-2 mb-2" />}

                {uploadStatus === "success" && uploadedFileUrl && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Uploaded file:</p>
                    <div className="border rounded p-2">
                      <a
                        href={uploadedFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {uploadedFileUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  <li>Use the "Create Test Images" button to generate new test images</li>
                  <li>Check that the image paths are correct in your code</li>
                  <li>Ensure that the images are properly deployed to your Vercel project</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">If File Upload Test Failed:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Check that your BLOB_READ_WRITE_TOKEN is set correctly</li>
                  <li>Verify that the upload API route is working correctly</li>
                  <li>Try uploading a smaller file (less than 1MB)</li>
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

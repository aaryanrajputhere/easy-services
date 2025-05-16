"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Loader2,
  FileText,
  ImageIcon,
  Server,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { EnhancedImage } from "@/components/ui/enhanced-image"
import { Progress } from "@/components/ui/progress"
import { formatBytes } from "@/lib/diagnostics-utils"

export default function AdvancedDiagnosticsPage() {
  // State for image diagnostics
  const [imageCheckResults, setImageCheckResults] = useState<any[]>([])
  const [isCheckingImages, setIsCheckingImages] = useState(false)
  const [imageCheckError, setImageCheckError] = useState<string | null>(null)

  // State for test image creation
  const [testImages, setTestImages] = useState<any[]>([])
  const [isCreatingTestImages, setIsCreatingTestImages] = useState(false)
  const [createImagesError, setCreateImagesError] = useState<string | null>(null)

  // State for upload testing
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<any>(null)

  // State for system info
  const [systemInfo, setSystemInfo] = useState<any>(null)
  const [envVars, setEnvVars] = useState<any>(null)

  // State for custom image check
  const [customImageUrl, setCustomImageUrl] = useState("")
  const [customImageResult, setCustomImageResult] = useState<any>(null)
  const [isCheckingCustomImage, setIsCheckingCustomImage] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLPreElement>(null)

  // Log function
  const log = (message: string, type: "info" | "success" | "error" | "warning" = "info") => {
    if (!logRef.current) return

    const timestamp = new Date().toISOString()
    const colorClass = {
      info: "text-blue-500",
      success: "text-green-500",
      error: "text-red-500",
      warning: "text-yellow-500",
    }[type]

    const logEntry = document.createElement("div")
    logEntry.className = colorClass
    logEntry.innerHTML = `[${timestamp}] ${message}`

    logRef.current.appendChild(logEntry)
    logRef.current.scrollTop = logRef.current.scrollHeight
  }

  // Check system status
  const checkSystemStatus = async () => {
    try {
      log("Checking system status...", "info")
      const response = await fetch("/api/diagnostics")

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      setSystemInfo(data.systemInfo)
      setEnvVars(data.envCheck)

      log("System status check completed", "success")
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      log(`Error checking system status: ${errorMessage}`, "error")
      return null
    }
  }

  // Check image paths
  const checkImagePaths = async () => {
    setIsCheckingImages(true)
    setImageCheckError(null)

    try {
      log("Checking image paths...", "info")
      const response = await fetch("/api/diagnostics?action=check-images")

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      setImageCheckResults(data.results)

      // Count accessible images
      const accessibleCount = data.results.filter((r: any) => r.accessible).length
      log(
        `Image check completed. ${accessibleCount}/${data.results.length} images accessible.`,
        accessibleCount === data.results.length ? "success" : "warning",
      )

      return data.results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setImageCheckError(errorMessage)
      log(`Error checking images: ${errorMessage}`, "error")
      return []
    } finally {
      setIsCheckingImages(false)
    }
  }

  // Create test images
  const createTestImages = async () => {
    setIsCreatingTestImages(true)
    setCreateImagesError(null)

    try {
      log("Creating test images...", "info")
      const response = await fetch("/api/diagnostics?action=create-test-images")

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      setTestImages(data.results)

      // Count successful creations
      const successCount = data.results.filter((r: any) => r.success).length
      log(
        `Test image creation completed. ${successCount}/${data.results.length} images created.`,
        successCount === data.results.length ? "success" : "warning",
      )

      return data.results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setCreateImagesError(errorMessage)
      log(`Error creating test images: ${errorMessage}`, "error")
      return []
    } finally {
      setIsCreatingTestImages(false)
    }
  }

  // Test upload functionality
  const testUploadFunctionality = async () => {
    setUploadStatus("uploading")
    setUploadError(null)
    setUploadProgress(0)

    try {
      log("Testing upload functionality...", "info")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 300)

      const response = await fetch("/api/diagnostics?action=test-upload")

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      setUploadResult(data.result)
      setUploadedFileUrl(data.result.url)
      setUploadStatus("success")

      log(`Upload test completed successfully. File URL: ${data.result.url}`, "success")

      return data.result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setUploadError(errorMessage)
      setUploadStatus("error")
      log(`Error testing upload: ${errorMessage}`, "error")
      return null
    }
  }

  // Test file upload with actual file
  const testFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setUploadStatus("uploading")
    setUploadError(null)
    setUploadProgress(0)

    try {
      log(`Testing file upload with ${file.name} (${formatBytes(file.size)})...`, "info")

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

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
        setUploadResult({
          name: file.name,
          url: data.url,
          size: formatBytes(file.size),
        })
        log(`File upload successful. URL: ${data.url}`, "success")
      } else {
        throw new Error(data.error || data.message || `Upload failed with status: ${response.status}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setUploadError(errorMessage)
      setUploadStatus("error")
      log(`Error uploading file: ${errorMessage}`, "error")
    }
  }

  // Check custom image URL
  const checkCustomImage = async () => {
    if (!customImageUrl) return

    setIsCheckingCustomImage(true)
    setCustomImageResult(null)

    try {
      log(`Checking custom image URL: ${customImageUrl}...`, "info")

      // For relative paths, convert to absolute URL
      let urlToCheck = customImageUrl
      if (customImageUrl.startsWith("/")) {
        urlToCheck = `${window.location.origin}${customImageUrl}`
      }

      const response = await fetch(`/api/diagnostics?action=check-images&url=${encodeURIComponent(urlToCheck)}`)

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      const result = data.results?.[0] || null

      setCustomImageResult(result)

      if (result?.accessible) {
        log(`Custom image check successful. Image is accessible.`, "success")
      } else {
        log(`Custom image check completed. Image is not accessible.`, "warning")
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      log(`Error checking custom image: ${errorMessage}`, "error")
      setCustomImageResult({
        accessible: false,
        error: errorMessage,
      })
      return null
    } finally {
      setIsCheckingCustomImage(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        log("Copied to clipboard", "success")
      })
      .catch((err) => {
        log(`Failed to copy: ${err}`, "error")
      })
  }

  // Download logs
  const downloadLogs = () => {
    if (!logRef.current) return

    const logText = logRef.current.innerText
    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `diagnostics-log-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    log("Logs downloaded", "success")
  }

  // Initialize
  useEffect(() => {
    checkSystemStatus()
    checkImagePaths()
  }, [])

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Diagnostics</h1>
          <p className="text-muted-foreground">Troubleshoot image display and document upload issues</p>
        </div>
        <div className="flex gap-2">
          <Link href="/diagnostics">
            <Button variant="outline">Basic Diagnostics</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="images">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Image Diagnostics
          </TabsTrigger>
          <TabsTrigger value="uploads">
            <Upload className="h-4 w-4 mr-2" />
            Upload Testing
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="h-4 w-4 mr-2" />
            System Info
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Image Diagnostics Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Path Accessibility</CardTitle>
              <CardDescription>Check if image paths are accessible and properly configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Button onClick={checkImagePaths} disabled={isCheckingImages}>
                  {isCheckingImages ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Image Paths"
                  )}
                </Button>
                <Button onClick={createTestImages} disabled={isCreatingTestImages}>
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

              {imageCheckError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <span>{imageCheckError}</span>
                  </div>
                </div>
              )}

              {imageCheckResults.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Path
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {imageCheckResults.map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <span className="truncate max-w-xs">{result.path}</span>
                              <button
                                onClick={() => copyToClipboard(result.fullUrl)}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                title="Copy URL"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {result.accessible ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Accessible
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Not Accessible
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.accessible ? (
                              <span>Status: {result.status}</span>
                            ) : (
                              <span>{result.error || `Status: ${result.status}`}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Check Custom Image URL</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter image URL or path (e.g., /images/example.jpg)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                  />
                  <Button onClick={checkCustomImage} disabled={isCheckingCustomImage || !customImageUrl}>
                    {isCheckingCustomImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
                  </Button>
                </div>

                {customImageResult && (
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">Status:</span>
                      {customImageResult.accessible ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accessible
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" />
                          Not Accessible
                        </span>
                      )}
                    </div>

                    {customImageResult.accessible ? (
                      <div className="mt-2">
                        <p className="text-sm mb-2">Image Preview:</p>
                        <div className="border rounded p-2 max-w-xs">
                          <EnhancedImage
                            src={customImageUrl}
                            alt="Custom image"
                            className="max-w-full h-auto"
                            showDebugInfo={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm">
                        {customImageResult.error || "Image could not be accessed"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {testImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Test Images Created:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {testImages.map((image, index) => (
                      <div key={index} className="border rounded p-2">
                        {image.success ? (
                          <>
                            <EnhancedImage
                              src={image.url}
                              alt={image.name}
                              className="max-w-full h-auto"
                              showDebugInfo={true}
                            />
                            <div className="mt-1 flex items-center justify-between">
                              <p className="text-xs truncate">{image.name}</p>
                              <button
                                onClick={() => copyToClipboard(image.url)}
                                className="text-gray-400 hover:text-gray-600"
                                title="Copy URL"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[150px] bg-red-50 text-red-500">
                            <XCircle className="h-8 w-8 mb-2" />
                            <p className="text-xs text-center">Failed to create {image.name}</p>
                            {image.error && <p className="text-xs text-center mt-1">{image.error}</p>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Testing Tab */}
        <TabsContent value="uploads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Upload Testing</CardTitle>
              <CardDescription>Test document upload functionality with automatic and manual tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Automatic Upload Test</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will generate a test document and upload it to test the upload API
                  </p>

                  <Button onClick={testUploadFunctionality} disabled={uploadStatus === "uploading"}>
                    {uploadStatus === "uploading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Run Automatic Upload Test"
                    )}
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Manual File Upload Test</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your own file to test the upload functionality
                  </p>

                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="mb-2 text-sm text-muted-foreground">Select a file to test the upload functionality</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="test-file-upload"
                      onChange={testFileUpload}
                      ref={fileInputRef}
                    />
                    <label htmlFor="test-file-upload">
                      <Button type="button" variant="outline" className="mt-2">
                        Select File
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {uploadStatus !== "idle" && (
                <div className="mt-6">
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
                        <span>Upload failed</span>
                      </div>
                    )}
                  </div>

                  {uploadStatus === "uploading" && <Progress value={uploadProgress} className="h-2 mb-2" />}

                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        <span>{uploadError}</span>
                      </div>
                    </div>
                  )}

                  {uploadStatus === "success" && uploadResult && (
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Upload Result:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">File Name:</span>
                          <span>{uploadResult.name}</span>
                        </div>
                        {uploadResult.size && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">File Size:</span>
                            <span>{uploadResult.size}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-medium">URL:</span>
                          <div className="flex items-center">
                            <span className="truncate max-w-xs">{uploadResult.url}</span>
                            <button
                              onClick={() => copyToClipboard(uploadResult.url)}
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Copy URL"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <a
                              href={uploadResult.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              title="Open URL"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Info Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Details about the environment and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Variable
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {envVars && (
                          <>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">BLOB_READ_WRITE_TOKEN</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {envVars.hasBlobToken ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Available
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Missing
                                  </span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">RESEND_API_KEY</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {envVars.hasResendApiKey ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Available
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Missing
                                  </span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">NODE_ENV</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{envVars.nodeEnv || "Not set"}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {systemInfo && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">System Details</h3>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Timestamp:</span>
                        <span>{systemInfo.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Node Version:</span>
                        <span>{systemInfo.nodeVersion}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Platform:</span>
                        <span>{systemInfo.platform}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">Browser Information</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">User Agent:</span>
                      <span className="truncate max-w-md">{navigator.userAgent}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Window Size:</span>
                      <span>{`${window.innerWidth}x${window.innerHeight}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Device Pixel Ratio:</span>
                      <span>{window.devicePixelRatio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Diagnostic Logs</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={downloadLogs}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Logs
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Detailed logs of all diagnostic operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-2 bg-gray-50">
                <pre ref={logRef} className="text-xs font-mono h-[400px] overflow-auto p-2 whitespace-pre-wrap">
                  {/* Logs will be appended here */}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">If Images Are Not Displaying:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Check that image paths are correct in your code</li>
                  <li>Verify that images exist in the correct directories</li>
                  <li>Use the "Create Test Images" button to generate new test images</li>
                  <li>Update your code to use the EnhancedImage component for better error handling</li>
                  <li>Check browser console for CORS or other errors</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">If Document Uploads Are Failing:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Verify that BLOB_READ_WRITE_TOKEN is set correctly</li>
                  <li>Check that the upload API route is working with the automatic test</li>
                  <li>Try uploading smaller files (less than 1MB)</li>
                  <li>Check browser console for any JavaScript errors</li>
                  <li>Verify that the form is correctly configured to handle file uploads</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium">Next Steps:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Update your code to use the EnhancedImage component for better error handling</li>
                  <li>If test images work but your images don't, replace your images with the test images</li>
                  <li>Check Vercel logs for any server-side errors</li>
                  <li>If all else fails, try redeploying your application</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { formatBytes } from "@/lib/diagnostics-utils"

export type UploadedDocument = {
  id: string
  name: string
  url: string
  size: number
  type: string
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface DocumentUploaderProps {
  onUploadComplete?: (documents: UploadedDocument[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxSizeInBytes?: number
  allowedFileTypes?: string[]
  uploadEndpoint?: string
  showPreview?: boolean
}

export function DocumentUploader({
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSizeInBytes = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  uploadEndpoint = "/api/upload",
  showPreview = true,
}: DocumentUploaderProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload
  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > maxSizeInBytes) {
        setUploadError(`File ${file.name} exceeds the maximum size of ${formatBytes(maxSizeInBytes)}`)
        if (onUploadError) onUploadError(`File ${file.name} exceeds the maximum size of ${formatBytes(maxSizeInBytes)}`)
        return null
      }

      // Validate file type
      if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
        setUploadError(`File type ${file.type} is not allowed`)
        if (onUploadError) onUploadError(`File type ${file.type} is not allowed`)
        return null
      }

      // Generate a unique ID for this upload
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      // Create a new document entry with "uploading" status
      const newDocument: UploadedDocument = {
        id: uploadId,
        name: file.name,
        url: "",
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      }

      // Add the new document to the state
      setUploadedDocuments((prev) => [...prev, newDocument])

      try {
        // Create form data for the file
        const formData = new FormData()
        formData.append("file", file)

        // Log what we're about to upload
        console.log(`Attempting to upload file: ${file.name}, size: ${formatBytes(file.size)}, type: ${file.type}`)

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadedDocuments((prev) => {
            return prev.map((doc) => {
              if (doc.id === uploadId && doc.status === "uploading") {
                return {
                  ...doc,
                  progress: Math.min(doc.progress + 10, 90),
                }
              }
              return doc
            })
          })
        }, 300)

        // Upload the file to our API route
        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        // Check if the request was successful
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
          throw new Error(errorData.error || errorData.message || `Upload failed with status: ${response.status}`)
        }

        // Parse the response
        const result = await response.json()

        console.log("Upload response:", result)

        // Update the document with the URL and success status
        setUploadedDocuments((prev) => {
          return prev.map((doc) => {
            if (doc.id === uploadId) {
              return {
                ...doc,
                url: result.url,
                status: "success",
                progress: 100,
              }
            }
            return doc
          })
        })

        console.log(`File uploaded successfully: ${result.url}`)
        setUploadError(null)

        // Notify parent component
        if (onUploadComplete) {
          const updatedDocs = [
            ...uploadedDocuments.filter((doc) => doc.id !== uploadId),
            {
              ...newDocument,
              url: result.url,
              status: "success",
              progress: 100,
            },
          ]
          onUploadComplete(updatedDocs)
        }

        return result.url
      } catch (error) {
        console.error("Error uploading file:", error)

        // Update the document with error status
        setUploadedDocuments((prev) => {
          return prev.map((doc) => {
            if (doc.id === uploadId) {
              return {
                ...doc,
                status: "error",
                progress: 100,
                error: error instanceof Error ? error.message : "Unknown error",
              }
            }
            return doc
          })
        })

        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        setUploadError(`Failed to upload document: ${errorMessage}`)

        // Notify parent component
        if (onUploadError) onUploadError(errorMessage)

        return null
      }
    },
    [allowedFileTypes, maxSizeInBytes, onUploadComplete, onUploadError, uploadEndpoint, uploadedDocuments],
  )

  // Handle file selection
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        // Check if we're exceeding the max files limit
        if (uploadedDocuments.length + e.target.files.length > maxFiles) {
          setUploadError(`You can only upload a maximum of ${maxFiles} files`)
          if (onUploadError) onUploadError(`You can only upload a maximum of ${maxFiles} files`)
          return
        }

        const files = Array.from(e.target.files)
        console.log(`Selected ${files.length} files for upload`)

        // Clear any previous errors
        setUploadError(null)

        // Upload each file
        for (const file of files) {
          await uploadFile(file)
        }

        // Clear the file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [maxFiles, onUploadError, uploadFile, uploadedDocuments.length],
  )

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Check if we're exceeding the max files limit
        if (uploadedDocuments.length + e.dataTransfer.files.length > maxFiles) {
          setUploadError(`You can only upload a maximum of ${maxFiles} files`)
          if (onUploadError) onUploadError(`You can only upload a maximum of ${maxFiles} files`)
          return
        }

        const files = Array.from(e.dataTransfer.files)
        console.log(`Dropped ${files.length} files for upload`)

        // Clear any previous errors
        setUploadError(null)

        // Upload each file
        files.forEach((file) => {
          uploadFile(file)
        })
      }
    },
    [maxFiles, onUploadError, uploadFile, uploadedDocuments.length],
  )

  // Remove a document
  const removeDocument = useCallback(
    (id: string) => {
      setUploadedDocuments((prev) => {
        const updatedDocs = prev.filter((doc) => doc.id !== id)
        if (onUploadComplete) onUploadComplete(updatedDocs)
        return updatedDocs
      })
    },
    [onUploadComplete],
  )

  // Retry a failed upload
  const retryUpload = useCallback(
    (id: string) => {
      // Find the document that failed
      const failedDoc = uploadedDocuments.find((doc) => doc.id === id)
      if (!failedDoc) return

      // Remove the failed document
      setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id))

      // If we have a file input, prompt the user to select the file again
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    },
    [uploadedDocuments],
  )

  return (
    <div className="space-y-4">
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <p className="mb-2 text-sm text-muted-foreground">Drag and drop files here, or click to select files</p>
        <p className="text-xs text-muted-foreground mb-4">Maximum file size: {formatBytes(maxSizeInBytes)}</p>
        <Input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept={allowedFileTypes.join(",")}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" className="mt-2">
            Select Files
          </Button>
        </label>
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Uploaded Documents ({uploadedDocuments.length}/{maxFiles}):
          </h3>
          <ul className="space-y-2">
            {uploadedDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center space-x-2 max-w-[80%]">
                  {doc.status === "uploading" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  ) : doc.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <div className="overflow-hidden">
                    <span className="text-sm truncate block">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{formatBytes(doc.size)}</span>
                  </div>
                </div>
                {doc.status === "uploading" ? (
                  <div className="w-24">
                    <Progress value={doc.progress} className="h-2" />
                  </div>
                ) : doc.status === "error" ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => retryUpload(doc.id)}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(doc.id)}
                    disabled={doc.status === "uploading"}
                  >
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
          {uploadedDocuments.some((doc) => doc.status === "error") && (
            <p className="text-xs text-red-500 mt-2">Some documents failed to upload. Please retry or remove them.</p>
          )}
        </div>
      )}

      {showPreview && uploadedDocuments.some((doc) => doc.status === "success" && doc.type.startsWith("image/")) && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Image Previews:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {uploadedDocuments
              .filter((doc) => doc.status === "success" && doc.type.startsWith("image/"))
              .map((doc) => (
                <div key={`preview-${doc.id}`} className="border rounded-md p-2">
                  <img
                    src={doc.url || "/placeholder.svg"}
                    alt={doc.name}
                    className="w-full h-auto object-contain max-h-32"
                  />
                  <p className="text-xs truncate mt-1">{doc.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

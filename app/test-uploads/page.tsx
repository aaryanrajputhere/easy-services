"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DocumentUploader, type UploadedDocument } from "@/components/ui/document-uploader"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function TestUploadsPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState<string | null>(null)

  const handleUploadComplete = (documents: UploadedDocument[]) => {
    setUploadedDocuments(documents)
    setUploadError(null)

    if (documents.length > 0 && documents.every((doc) => doc.status === "success")) {
      setTestResult("success")
      setTestMessage(`Successfully uploaded ${documents.length} document(s)`)
    }
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    setTestResult("error")
    setTestMessage(error)
  }

  const resetTest = () => {
    setUploadedDocuments([])
    setUploadError(null)
    setTestResult("idle")
    setTestMessage(null)
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Document Uploads</h1>
        <div className="flex gap-2">
          <Link href="/advanced-diagnostics">
            <Button variant="outline">Advanced Diagnostics</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>

      {testResult === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Upload Test Successful</p>
            <p>{testMessage}</p>
          </div>
        </div>
      )}

      {testResult === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Upload Test Failed</p>
            <p>{testMessage}</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This page allows you to test the document upload functionality. Try uploading different types of files to
            verify that the upload process works correctly.
          </p>

          <DocumentUploader
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            maxFiles={5}
            maxSizeInBytes={5 * 1024 * 1024} // 5MB
            showPreview={true}
          />

          {uploadedDocuments.length > 0 && (
            <div className="mt-6">
              <Button onClick={resetTest} variant="outline">
                Reset Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">If Uploads Fail:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Check that your BLOB_READ_WRITE_TOKEN is set correctly in your environment variables</li>
                <li>Try uploading smaller files (less than 1MB)</li>
                <li>Check browser console for any JavaScript errors</li>
                <li>Try different file types (PDF, JPEG, PNG)</li>
                <li>Run the Advanced Diagnostics to get more detailed information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Next Steps:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>If uploads work here but not on the application page, check for JavaScript errors on that page</li>
                <li>Verify that the upload API endpoint is correctly configured</li>
                <li>Check that the form submission process correctly includes the uploaded documents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

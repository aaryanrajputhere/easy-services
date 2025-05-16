import { headers } from "next/headers"

export default function DebugPage() {
  // This is a server component, so we can safely check environment variables
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN
  const headersList = headers()
  const host = headersList.get("host") || "unknown"

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Environment</h2>
        <p>
          <strong>Node Environment:</strong> {process.env.NODE_ENV || "not set"}
        </p>
        <p>
          <strong>Has BLOB_READ_WRITE_TOKEN:</strong> {hasBlobToken ? "Yes" : "No"}
        </p>
        <p>
          <strong>Host:</strong> {host}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Check that your environment variables are correctly set in Vercel</li>
          <li>Make sure your middleware.ts file doesn't have any errors</li>
          <li>Verify that your API routes are working correctly</li>
          <li>Check for any third-party packages that might be causing issues</li>
        </ol>
      </div>
    </div>
  )
}

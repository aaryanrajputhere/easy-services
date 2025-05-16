import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that just passes the request through
export function middleware(request: NextRequest) {
  // Just pass the request through without any processing
  return NextResponse.next()
}

// Limit middleware to specific paths to reduce chances of errors
export const config = {
  matcher: [
    // Apply middleware only to specific paths
    "/api/upload",
    "/apply",
  ],
}

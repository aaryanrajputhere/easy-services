import { NextResponse } from "next/server"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"

// This would be set up with your Google Service Account credentials
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // Initialize the sheet
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID!, serviceAccountAuth)
    await doc.loadInfo() // loads document properties and worksheets

    // Get the first sheet
    const sheet = doc.sheetsByIndex[0]

    // Format the data for the spreadsheet
    const row = {
      timestamp: new Date().toISOString(),
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      businessCity: data.businessCity,
      businessState: data.businessState,
      businessZip: data.businessZip,
      yearsInBusiness: data.yearsInBusiness,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      ownerPhone: data.ownerPhone,
      monthlyRevenue: data.monthlyRevenue,
      requestedAmount: data.requestedAmount,
      useOfFunds: data.useOfFunds,
    }

    // Add the row to the sheet
    await sheet.addRow(row)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving to Google Sheets:", error)
    return NextResponse.json({ success: false, error: "Failed to save application data" }, { status: 500 })
  }
}

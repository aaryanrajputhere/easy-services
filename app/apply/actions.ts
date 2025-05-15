"use server"

import { Resend } from "resend"

// Initialize Resend with your API key
// You'll need to add RESEND_API_KEY to your environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

// Define the application data type
type ApplicationData = {
  businessName: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  yearsInBusiness: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  monthlyRevenue: string
  requestedAmount: string
  useOfFunds: string
}

export async function submitApplication(formData: ApplicationData) {
  try {
    // Send email notification
    const { data, error } = await resend.emails.send({
      from: "Easy Services <applications@easyservices.info>",
      to: "info@easyservices.info",
      subject: `New MCA Application: ${formData.businessName}`,
      html: `
        <h1>New Merchant Cash Advance Application</h1>
        <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        
        <h2>Business Information</h2>
        <ul>
          <li><strong>Business Name:</strong> ${formData.businessName}</li>
          <li><strong>Years in Business:</strong> ${formData.yearsInBusiness}</li>
          <li><strong>Address:</strong> ${formData.businessAddress}, ${formData.businessCity}, ${formData.businessState} ${formData.businessZip}</li>
        </ul>
        
        <h2>Owner Information</h2>
        <ul>
          <li><strong>Name:</strong> ${formData.ownerName}</li>
          <li><strong>Email:</strong> ${formData.ownerEmail}</li>
          <li><strong>Phone:</strong> ${formData.ownerPhone}</li>
        </ul>
        
        <h2>Financial Information</h2>
        <ul>
          <li><strong>Monthly Revenue:</strong> ${formData.monthlyRevenue}</li>
          <li><strong>Requested Amount:</strong> ${formData.requestedAmount}</li>
          <li><strong>Use of Funds:</strong> ${formData.useOfFunds}</li>
        </ul>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error("Failed to send email notification")
    }

    // Log the application data (for now, until you implement Google Sheets later)
    console.log("Application submitted:", formData)

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Error processing application:", error)
    return { success: false, error: "Failed to process application" }
  }
}

"use server"

import { Resend } from "resend"

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY
const resend = new Resend(resendApiKey)

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
  console.log("Submitting application with data:", formData)
  console.log("Using Resend API Key:", resendApiKey ? "API key is set" : "API key is missing")

  try {
    // For testing purposes, let's log what we're about to do
    console.log("Attempting to send email to info@easyservices.info")

    // Send email notification
    const emailResult = await resend.emails.send({
      from: "Easy Services <onboarding@resend.dev>", // Use Resend's default sender for testing
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

    console.log("Email send result:", emailResult)

    if (emailResult.error) {
      console.error("Error sending email:", emailResult.error)
      return { success: false, error: `Failed to send email: ${emailResult.error.message}` }
    }

    // Log the application data
    console.log("Application submitted successfully:", formData)

    // Return success
    return { success: true }
  } catch (error: any) {
    console.error("Error processing application:", error)
    return {
      success: false,
      error: `Failed to process application: ${error.message || "Unknown error"}`,
    }
  }
}

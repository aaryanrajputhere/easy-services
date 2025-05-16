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
  documents: Array<{
    name: string
    url: string
  }>
}

export async function submitApplication(formData: ApplicationData) {
  console.log("Submitting application with data:", formData)
  console.log("Documents received:", formData.documents)

  try {
    // Log the submission (this will work regardless of email setup)
    console.log("Application submitted:", {
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      requestedAmount: formData.requestedAmount,
      documents: formData.documents || [],
    })

    // Try to send email if Resend API key is available
    if (resendApiKey) {
      try {
        console.log("Attempting to send email notifications")

        // Prepare document links for the email
        const documentLinks =
          formData.documents && formData.documents.length > 0
            ? formData.documents.map((doc) => `<li><a href="${doc.url}" target="_blank">${doc.name}</a></li>`).join("")
            : "<li>No documents uploaded</li>"

        // Send email notification to admin
        const adminEmailResult = await resend.emails.send({
          from: "onboarding@resend.dev", // Use Resend's default sender
          to: "info@easyservices.info", // Your admin email
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
            
            <h2>Uploaded Documents</h2>
            <ul>
              ${documentLinks}
            </ul>
          `,
        })

        console.log("Admin email send result:", adminEmailResult)

        // Send confirmation email to the applicant
        const confirmationResult = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: formData.ownerEmail,
          subject: "Your Merchant Cash Advance Application - Easy Services",
          html: `
            <h1>Thank You for Your Application</h1>
            <p>Dear ${formData.ownerName},</p>
            <p>We have received your merchant cash advance application for ${formData.businessName}.</p>
            <p>Our team will review your information and contact you within 24 hours.</p>
            <p>If you have any questions, please contact us at info@easyservices.info.</p>
            <p>Sincerely,<br>Easy Services Team</p>
          `,
        })

        console.log("Confirmation email send result:", confirmationResult)
      } catch (emailError) {
        console.error("Error sending emails:", emailError)
        // Continue even if email sending fails
      }
    } else {
      console.log("Skipping email notifications - Resend API key not configured")
    }

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Error in submitApplication:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during submission",
    }
  }
}

"use server"

import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Define the type for the application data
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
  documents?: Array<{ name: string; url: string }>
}

export async function submitApplication(data: ApplicationData) {
  try {
    console.log("Submitting application:", data)

    // Format the documents list for the email
    const documentsList =
      data.documents && data.documents.length > 0
        ? data.documents.map((doc) => `<li><a href="${doc.url}" target="_blank">${doc.name}</a></li>`).join("")
        : "<li>No documents uploaded</li>"

    // Send confirmation email to the applicant
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "Easy Services <onboarding@resend.dev>",
        to: [data.ownerEmail],
        subject: "Your Application Has Been Received",
        html: `
          <h1>Thank you for your application, ${data.ownerName}!</h1>
          <p>We have received your merchant cash advance application for ${data.businessName}.</p>
          <p>Our team will review your application and get back to you within 24 hours.</p>
          <h2>Application Details:</h2>
          <ul>
            <li><strong>Business Name:</strong> ${data.businessName}</li>
            <li><strong>Business Address:</strong> ${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}</li>
            <li><strong>Years in Business:</strong> ${data.yearsInBusiness}</li>
            <li><strong>Monthly Revenue:</strong> ${data.monthlyRevenue}</li>
            <li><strong>Requested Amount:</strong> ${data.requestedAmount}</li>
          </ul>
          <p>If you have any questions, please reply to this email or call us at (555) 123-4567.</p>
          <p>Thank you for choosing Easy Services for your business funding needs.</p>
        `,
      })

      if (emailError) {
        console.error("Error sending confirmation email:", emailError)
      } else {
        console.log("Confirmation email sent:", emailData)
      }
    } catch (emailError) {
      console.error("Exception sending confirmation email:", emailError)
    }

    // Send notification email to the admin
    try {
      const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
        from: "Easy Services <onboarding@resend.dev>",
        to: ["info@easyservices.info"], // Replace with your admin email
        subject: `New Application: ${data.businessName}`,
        html: `
          <h1>New Merchant Cash Advance Application</h1>
          <h2>Business Information:</h2>
          <ul>
            <li><strong>Business Name:</strong> ${data.businessName}</li>
            <li><strong>Business Address:</strong> ${data.businessAddress}, ${data.businessCity}, ${data.businessState} ${data.businessZip}</li>
            <li><strong>Years in Business:</strong> ${data.yearsInBusiness}</li>
          </ul>
          <h2>Owner Information:</h2>
          <ul>
            <li><strong>Owner Name:</strong> ${data.ownerName}</li>
            <li><strong>Email:</strong> ${data.ownerEmail}</li>
            <li><strong>Phone:</strong> ${data.ownerPhone}</li>
          </ul>
          <h2>Financial Information:</h2>
          <ul>
            <li><strong>Monthly Revenue:</strong> ${data.monthlyRevenue}</li>
            <li><strong>Requested Amount:</strong> ${data.requestedAmount}</li>
            <li><strong>Use of Funds:</strong> ${data.useOfFunds}</li>
          </ul>
          <h2>Uploaded Documents:</h2>
          <ul>
            ${documentsList}
          </ul>
        `,
      })

      if (adminEmailError) {
        console.error("Error sending admin notification email:", adminEmailError)
      } else {
        console.log("Admin notification email sent:", adminEmailData)
      }
    } catch (adminEmailError) {
      console.error("Exception sending admin notification email:", adminEmailError)
    }

    // Return success response
    return {
      success: true,
      message: "Application submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting application:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

"use server"

// Simple version without any dependencies
export async function submitApplication(formData: any) {
  console.log("Form submission received:", formData)

  try {
    // Log the submission (this will work regardless of email setup)
    console.log("Application submitted:", {
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      ownerEmail: formData.ownerEmail,
      requestedAmount: formData.requestedAmount,
      // other fields...
    })

    // Store in localStorage on the client side
    // We'll implement this in the page component

    // Return success
    return { success: true }
  } catch (error) {
    console.error("Error in submitApplication:", error)
    return { success: false, error: "An error occurred during submission" }
  }
}

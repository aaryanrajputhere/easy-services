"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeDollarSign, ArrowLeft, Upload, Loader2, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitApplication } from "./actions"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

type UploadedDocument = {
  name: string
  url: string
  status: "uploading" | "success" | "error"
  progress: number
}

export default function ApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    yearsInBusiness: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    monthlyRevenue: "",
    requestedAmount: "",
    useOfFunds: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const uploadFile = async (file: File) => {
    // Create a new document entry with "uploading" status
    const newDocument: UploadedDocument = {
      name: file.name,
      url: "",
      status: "uploading",
      progress: 0,
    }

    setUploadedDocuments((prev) => [...prev, newDocument])
    const documentIndex = uploadedDocuments.length

    try {
      // Create form data for the file
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadedDocuments((prev) => {
          const updated = [...prev]
          if (updated[documentIndex] && updated[documentIndex].status === "uploading") {
            updated[documentIndex] = {
              ...updated[documentIndex],
              progress: Math.min(updated[documentIndex].progress + 10, 90),
            }
          }
          return updated
        })
      }, 300)

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()

      // Update the document with the URL and success status
      setUploadedDocuments((prev) => {
        const updated = [...prev]
        if (updated[documentIndex]) {
          updated[documentIndex] = {
            name: result.name,
            url: result.url,
            status: "success",
            progress: 100,
          }
        }
        return updated
      })

      return result.url
    } catch (error) {
      console.error("Error uploading file:", error)

      // Update the document with error status
      setUploadedDocuments((prev) => {
        const updated = [...prev]
        if (updated[documentIndex]) {
          updated[documentIndex] = {
            ...updated[documentIndex],
            status: "error",
            progress: 100,
          }
        }
        return updated
      })

      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })

      return null
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)

      toast({
        title: "Uploading Documents",
        description: `Uploading ${files.length} document(s)...`,
      })

      // Upload each file
      for (const file of files) {
        await uploadFile(file)
      }
    }
  }

  const removeDocument = (index: number) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    const requiredFields = [
      { key: "businessName", label: "Business name" },
      { key: "businessAddress", label: "Business address" },
      { key: "businessCity", label: "City" },
      { key: "businessState", label: "State" },
      { key: "businessZip", label: "ZIP code" },
      { key: "yearsInBusiness", label: "Years in business" },
      { key: "ownerName", label: "Owner name" },
      { key: "ownerEmail", label: "Email" },
      { key: "ownerPhone", label: "Phone" },
      { key: "monthlyRevenue", label: "Monthly revenue" },
      { key: "requestedAmount", label: "Requested amount" },
      { key: "useOfFunds", label: "Use of funds" },
    ]

    requiredFields.forEach((field) => {
      if (!formData[field.key as keyof typeof formData]) {
        newErrors[field.key] = `${field.label} is required`
      }
    })

    // Email validation
    if (formData.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    toast({
      title: "Submitting Application",
      description: "Please wait while we process your application...",
    })

    try {
      // Prepare the documents data
      const successfulDocuments = uploadedDocuments
        .filter((doc) => doc.status === "success")
        .map(({ name, url }) => ({ name, url }))

      // Submit the application with documents
      const result = await submitApplication({
        ...formData,
        documents: successfulDocuments,
      })

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully!",
        })

        // Redirect to success page
        router.push("/apply/success")
      } else {
        throw new Error(result.error || "Failed to submit application")
      }
    } catch (error: any) {
      console.error("Error submitting application:", error)
      setIsSubmitting(false)

      toast({
        title: "Submission Error",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-emerald-600 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="flex items-center gap-2 mb-8">
        <BadgeDollarSign className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-bold">Easy Services - Merchant Cash Advance Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Funding Application</CardTitle>
          <CardDescription>
            Fill out the form below to apply for a merchant cash advance with Easy Services. We&apos;ll review your
            application and get back to you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Business Information</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={errors.businessName ? "border-red-500" : ""}
                  />
                  {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("yearsInBusiness", value)}
                    value={formData.yearsInBusiness}
                  >
                    <SelectTrigger className={errors.yearsInBusiness ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select years in business" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearsInBusiness && <p className="text-sm text-red-500">{errors.yearsInBusiness}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  name="businessAddress"
                  placeholder="Street Address"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className={errors.businessAddress ? "border-red-500" : ""}
                />
                {errors.businessAddress && <p className="text-sm text-red-500">{errors.businessAddress}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="businessCity">City</Label>
                  <Input
                    id="businessCity"
                    name="businessCity"
                    placeholder="City"
                    value={formData.businessCity}
                    onChange={handleChange}
                    className={errors.businessCity ? "border-red-500" : ""}
                  />
                  {errors.businessCity && <p className="text-sm text-red-500">{errors.businessCity}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessState">State</Label>
                  <Input
                    id="businessState"
                    name="businessState"
                    placeholder="State"
                    value={formData.businessState}
                    onChange={handleChange}
                    className={errors.businessState ? "border-red-500" : ""}
                  />
                  {errors.businessState && <p className="text-sm text-red-500">{errors.businessState}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessZip">ZIP Code</Label>
                  <Input
                    id="businessZip"
                    name="businessZip"
                    placeholder="ZIP Code"
                    value={formData.businessZip}
                    onChange={handleChange}
                    className={errors.businessZip ? "border-red-500" : ""}
                  />
                  {errors.businessZip && <p className="text-sm text-red-500">{errors.businessZip}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Owner Information</h2>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  placeholder="Full Name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={errors.ownerName ? "border-red-500" : ""}
                />
                {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Email</Label>
                  <Input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    placeholder="Email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className={errors.ownerEmail ? "border-red-500" : ""}
                  />
                  {errors.ownerEmail && <p className="text-sm text-red-500">{errors.ownerEmail}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Phone</Label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    placeholder="Phone Number"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className={errors.ownerPhone ? "border-red-500" : ""}
                  />
                  {errors.ownerPhone && <p className="text-sm text-red-500">{errors.ownerPhone}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Financial Information</h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("monthlyRevenue", value)}
                    value={formData.monthlyRevenue}
                  >
                    <SelectTrigger className={errors.monthlyRevenue ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select monthly revenue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k+">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.monthlyRevenue && <p className="text-sm text-red-500">{errors.monthlyRevenue}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedAmount">Requested Amount</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("requestedAmount", value)}
                    value={formData.requestedAmount}
                  >
                    <SelectTrigger className={errors.requestedAmount ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select requested amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-25k">$5,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k+">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.requestedAmount && <p className="text-sm text-red-500">{errors.requestedAmount}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="useOfFunds">Use of Funds</Label>
                <Textarea
                  id="useOfFunds"
                  name="useOfFunds"
                  placeholder="Please describe how you plan to use the funds..."
                  className={`min-h-[100px] ${errors.useOfFunds ? "border-red-500" : ""}`}
                  value={formData.useOfFunds}
                  onChange={handleChange}
                />
                {errors.useOfFunds && <p className="text-sm text-red-500">{errors.useOfFunds}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Document Upload</h2>
              <p className="text-sm text-muted-foreground">
                Please upload your last 3 months of bank statements and any other relevant documents.
              </p>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="mb-2 text-sm text-muted-foreground">Drag and drop files here, or click to select files</p>
                <Input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" className="mt-2">
                    Select Files
                  </Button>
                </label>
              </div>

              {uploadedDocuments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Uploaded Documents:</h3>
                  <ul className="space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center space-x-2 max-w-[80%]">
                          {doc.status === "uploading" ? (
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                          ) : doc.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm truncate">{doc.name}</span>
                        </div>
                        {doc.status === "uploading" ? (
                          <div className="w-24">
                            <Progress value={doc.progress} className="h-2" />
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                            disabled={doc.status === "uploading"}
                          >
                            Remove
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting this application, you agree to Easy Services' Terms of Service and Privacy Policy. We will
              review your application and contact you within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

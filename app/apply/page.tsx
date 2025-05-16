"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeDollarSign, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ApplicationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to success page
      router.push("/apply/success")
    } catch (error) {
      console.error("Error submitting application:", error)
      setIsSubmitting(false)
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
        <h1 className="text-3xl font-bold">Merchant Cash Advance Application</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Funding Application</CardTitle>
          <CardDescription>
            Fill out the form below to apply for a merchant cash advance. We&apos;ll review your application and get
            back to you within 24 hours.
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

              {/* Rest of the form fields */}
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

            {/* Owner Information */}
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

            {/* Financial Information */}
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

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting this application, you agree to our Terms of Service and Privacy Policy. We will review your
              application and contact you within 24 hours.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

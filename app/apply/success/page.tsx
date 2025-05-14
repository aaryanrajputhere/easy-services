import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="container max-w-md py-20">
      <div className="flex flex-col items-center text-center space-y-6">
        <CheckCircle2 className="h-20 w-20 text-emerald-600" />

        <h1 className="text-3xl font-bold">Application Submitted!</h1>

        <p className="text-muted-foreground">
          Thank you for submitting your merchant cash advance application. Our team will review your information and
          contact you within 24 hours.
        </p>

        <div className="space-y-2">
          <p className="font-medium">What happens next?</p>
          <ol className="text-sm text-muted-foreground space-y-2 text-left">
            <li>1. Our underwriting team will review your application</li>
            <li>2. We may contact you for additional information</li>
            <li>3. You'll receive a funding decision within 24 hours</li>
            <li>4. Once approved, funds will be deposited into your account</li>
          </ol>
        </div>

        <Link href="/" passHref>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}

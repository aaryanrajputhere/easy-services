import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BadgeDollarSign, Building, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <BadgeDollarSign className="h-6 w-6 text-emerald-600" />
            <span className="text-xl">Easy Services</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-emerald-600">
              How It Works
            </Link>
            <Link href="#benefits" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Benefits
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-emerald-600">
              FAQ
            </Link>
            <Link href="/apply" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Apply Now
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/apply" passHref>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Get Funded
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Fast Business Funding When You Need It Most
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Easy Services provides merchant cash advances in as little as 24 hours. No collateral required.
                    Access $5,000 to $500,000 for your business needs.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/apply" passHref>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works" passHref>
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-muted md:h-[400px] lg:h-[500px]">
                  <img
                    src="/images/business-funding.jpg"
                    alt="Business owner reviewing finances"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  How Merchant Cash Advance Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple process designed to get your business the funding it needs quickly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  title: "1. Apply Online",
                  description: "Fill out our simple application form and upload your last 3 months of bank statements.",
                  icon: <Building className="h-10 w-10 text-emerald-600" />,
                  image: "/images/business-owner.jpg",
                },
                {
                  title: "2. Get Approved",
                  description:
                    "Receive a funding decision within 24 hours with flexible terms tailored to your business.",
                  icon: <Clock className="h-10 w-10 text-emerald-600" />,
                  image: "/images/funding-process.jpg",
                },
                {
                  title: "3. Receive Funds",
                  description: "Once approved, funds are deposited directly into your business bank account.",
                  icon: <BadgeDollarSign className="h-10 w-10 text-emerald-600" />,
                  image: "/images/business-funding.jpg",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 rounded-lg border p-6">
                  <div className="h-40 w-full mb-2 overflow-hidden rounded-lg">
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {step.icon}
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Benefits of Our Merchant Cash Advance
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Why thousands of businesses choose our funding solutions.
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Fast Approval",
                  description: "Get approved in as little as 24 hours, not weeks or months like traditional loans.",
                },
                {
                  title: "Simple Repayment",
                  description: "Repayments are made as a percentage of your daily credit card sales.",
                },
                {
                  title: "No Collateral Required",
                  description: "Unsecured funding means your business assets remain free and clear.",
                },
                {
                  title: "Bad Credit Accepted",
                  description: "We focus on your business performance, not just your credit score.",
                },
                {
                  title: "Flexible Use of Funds",
                  description: "Use the money for inventory, equipment, marketing, or any business need.",
                },
                {
                  title: "High Approval Rate",
                  description: "We approve 85% of applications, much higher than traditional bank loans.",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex flex-col space-y-2 rounded-lg border bg-white p-6">
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get answers to common questions about our merchant cash advance program.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 pt-8">
              {[
                {
                  question: "What is a Merchant Cash Advance?",
                  answer:
                    "A Merchant Cash Advance is not a loan, but a purchase of your future credit card sales. We provide you with a lump sum of capital, and in return, we collect a percentage of your daily credit card sales until the advance is paid back.",
                },
                {
                  question: "How much funding can I get?",
                  answer:
                    "Funding amounts typically range from $5,000 to $500,000, depending on your business's monthly revenue and time in business.",
                },
                {
                  question: "What are the requirements to qualify?",
                  answer:
                    "To qualify, your business should be operational for at least 6 months, have a minimum of $10,000 in monthly revenue, and have at least 3 months of bank statements to review.",
                },
                {
                  question: "How long does the application process take?",
                  answer:
                    "Our application process is quick and straightforward. You can complete the application in minutes, and receive a funding decision within 24 hours.",
                },
                {
                  question: "How is a Merchant Cash Advance different from a traditional loan?",
                  answer:
                    "Unlike traditional loans with fixed monthly payments, a Merchant Cash Advance is repaid through a percentage of your daily credit card sales. This means payments flex with your business – you pay less on slow days and more on busy days.",
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-lg border p-6">
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-600 text-white">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to grow your business?</h2>
              <p className="max-w-[600px] opacity-90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Apply now and get the funding you need in as little as 24 hours.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link href="/apply" passHref>
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-700">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Easy Services. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-emerald-600">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

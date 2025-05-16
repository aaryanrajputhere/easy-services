import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BadgeDollarSign } from "lucide-react"

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

        {/* Rest of your homepage content */}
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

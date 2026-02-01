import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Layers } from "lucide-react"

export const metadata: Metadata = {
  title: "Flooring Installation",
  description:
    "Professional flooring installation by Red White Reno. Hardwood, laminate, tile, and luxury vinyl flooring in Stratford, Ontario.",
}

const features = [
  "Hardwood floor installation",
  "Engineered hardwood options",
  "Laminate flooring",
  "Luxury vinyl plank (LVP)",
  "Ceramic and porcelain tile",
  "Natural stone flooring",
  "Floor removal and disposal",
  "Subfloor preparation and repair",
  "Baseboard and trim installation",
  "Heated floor systems",
]

const packages = [
  {
    name: "Single Room",
    starting: "2,500",
    description: "One room up to 200 sq ft",
  },
  {
    name: "Main Floor",
    starting: "8,000",
    description: "Living areas up to 800 sq ft",
  },
  {
    name: "Whole Home",
    starting: "15,000",
    description: "Complete home flooring solution",
  },
]

const flooringTypes = [
  {
    name: "Hardwood",
    description: "Classic beauty and lasting value. Oak, maple, walnut, and more.",
    priceRange: "$8-15/sq ft installed",
  },
  {
    name: "Engineered Hardwood",
    description: "Real wood veneer with enhanced stability. Great for any level.",
    priceRange: "$7-12/sq ft installed",
  },
  {
    name: "Laminate",
    description: "Affordable durability with realistic wood and stone looks.",
    priceRange: "$5-8/sq ft installed",
  },
  {
    name: "Luxury Vinyl (LVP)",
    description: "Waterproof, durable, and versatile. Perfect for any room.",
    priceRange: "$6-10/sq ft installed",
  },
]

export default function FlooringPage() {
  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">Flooring</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="size-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Flooring Installation
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:mt-6">
            New flooring transforms the entire look and feel of your home.
            Whether you prefer the warmth of hardwood, the practicality of
            laminate, or the versatility of luxury vinyl, we deliver
            professional installation with flawless results.
          </p>
        </div>
      </section>

      {/* Image Placeholder */}
      <section className="px-4 py-8">
        <div className="container mx-auto">
          <div className="aspect-[21/9] rounded-lg bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Flooring project gallery coming soon</p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            What&apos;s Included
          </h2>
          <p className="mt-2 text-muted-foreground">
            Our flooring services include everything from removal to the
            finishing touches.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3.5 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flooring Types */}
      <section className="border-t border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Flooring Options
          </h2>
          <p className="mt-2 text-muted-foreground">
            We work with all major flooring types to match your style and
            budget.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {flooringTypes.map((type) => (
              <Card key={type.name}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {type.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {type.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-primary">
                    {type.priceRange}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Project Pricing Guide
          </h2>
          <p className="mt-2 text-muted-foreground">
            These starting prices include standard installation with materials.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.name}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pkg.description}
                  </p>
                  <p className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      Starting from
                    </span>
                    <br />
                    <span className="text-2xl font-bold text-foreground">
                      ${pkg.starting}
                    </span>
                    <span className="text-sm text-muted-foreground"> + HST</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            * Prices vary based on flooring material, subfloor condition, and
            room complexity. Get a personalized quote for your specific project.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready for New Floors?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Get an instant quote to understand your investment, or contact us
            to discuss your flooring options.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 w-full px-8 sm:w-auto">
              <Link href="/estimate?service=flooring">
                Get Flooring Quote
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full px-8 sm:w-auto"
            >
              <Link href="/contact">Discuss Options</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

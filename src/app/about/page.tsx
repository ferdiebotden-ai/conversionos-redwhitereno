import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Award,
  Shield,
  Users,
  Heart,
  Target,
  MapPin,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Red White Reno - Stratford's trusted renovation contractor. Over 10 years of experience transforming homes in Perth County.",
}

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Your satisfaction drives everything we do. We listen, communicate, and deliver on our promises.",
  },
  {
    icon: Target,
    title: "Quality Craftsmanship",
    description:
      "We take pride in our work. Every detail matters, from initial design to final walkthrough.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Honest pricing, realistic timelines, and transparent communication throughout your project.",
  },
]

const certifications = [
  "Licensed Contractor - Ontario",
  "WSIB Coverage",
  "Fully Insured - $2M Liability",
  "Tarion Warranty Corporation Member",
]

const serviceAreas = [
  "Stratford",
  "St. Marys",
  "Mitchell",
  "Listowel",
  "Woodstock",
  "Kitchener-Waterloo",
]

export default function AboutPage() {
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
          <li className="text-foreground">About</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Building Trust, One Home at a Time
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              For over a decade, Red White Reno has been transforming homes in
              Stratford and Perth County. We combine traditional craftsmanship
              with modern innovation to deliver exceptional results.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Our Story
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Red White Reno started in 2015 with a simple mission: bring
                  quality renovation services to Stratford homeowners without
                  the big-city price tag. What began as a one-person operation
                  has grown into a trusted team of skilled craftsmen, designers,
                  and project managers.
                </p>
                <p>
                  We&apos;ve completed over 500 projects — from kitchen refreshes to
                  complete home transformations. Our reputation is built on
                  honest communication, quality workmanship, and treating every
                  home as if it were our own.
                </p>
                <p>
                  In 2024, we embraced AI technology to give our clients
                  something unique: the ability to visualize their renovation
                  before a single nail is hammered. It&apos;s innovation rooted in
                  our commitment to exceeding expectations.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Team photo coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="border-y border-border bg-primary px-4 py-12 md:py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
            To transform houses into dream homes through exceptional
            craftsmanship, innovative technology, and an unwavering commitment
            to customer satisfaction. We believe every homeowner deserves a
            renovation experience that&apos;s as enjoyable as the final result.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Values
            </h2>
            <p className="mt-2 text-muted-foreground">
              The principles that guide every project we undertake.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Meet the Team
            </h2>
            <p className="mt-2 text-muted-foreground">
              Experienced professionals dedicated to your project&apos;s success.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Owner / Lead Contractor", role: "Founder" },
              { name: "Project Manager", role: "Operations" },
              { name: "Lead Carpenter", role: "Construction" },
              { name: "Design Consultant", role: "Design" },
            ].map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto size-24 rounded-full bg-muted flex items-center justify-center">
                    <Users className="size-10 text-muted-foreground" />
                  </div>
                  <p className="mt-4 font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="px-4 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Certifications */}
            <div>
              <div className="flex items-center gap-3">
                <Award className="size-6 text-primary" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Licenses & Certifications
                </h2>
              </div>
              <ul className="mt-4 space-y-3">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Area */}
            <div>
              <div className="flex items-center gap-3">
                <MapPin className="size-6 text-primary" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Service Area
                </h2>
              </div>
              <p className="mt-4 text-muted-foreground">
                We proudly serve homeowners throughout Perth County and
                surrounding areas:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-12 md:py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Let&apos;s Build Something Together
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ready to start your renovation journey? We&apos;d love to hear about
            your project and show you what&apos;s possible.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 w-full px-8 sm:w-auto">
              <Link href="/estimate">Get a Free Quote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full px-8 sm:w-auto"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

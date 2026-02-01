import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChefHat, Bath, Sofa, Layers } from "lucide-react"

const services = [
  {
    slug: "kitchen",
    title: "Kitchen Renovation",
    description:
      "Transform your kitchen into a modern, functional space. From cabinet refacing to complete remodels.",
    icon: ChefHat,
  },
  {
    slug: "bathroom",
    title: "Bathroom Renovation",
    description:
      "Create your personal spa retreat. Showers, tubs, vanities, and complete bathroom transformations.",
    icon: Bath,
  },
  {
    slug: "basement",
    title: "Basement Finishing",
    description:
      "Unlock hidden living space. Convert your basement into a family room, home office, or rental suite.",
    icon: Sofa,
  },
  {
    slug: "flooring",
    title: "Flooring",
    description:
      "Hardwood, laminate, tile, or vinyl. Professional installation for any room in your home.",
    icon: Layers,
  },
]

interface ServicesGridProps {
  showLinks?: boolean
}

export function ServicesGrid({ showLinks = true }: ServicesGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} showLink={showLinks} />
      ))}
    </div>
  )
}

function ServiceCard({
  service,
  showLink,
}: {
  service: (typeof services)[number]
  showLink: boolean
}) {
  const Icon = service.icon

  const content = (
    <Card className="group h-full border-2 border-transparent transition-all hover:border-primary/20 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {service.description}
        </p>
        {showLink && (
          <span className="mt-4 text-sm font-medium text-primary">
            Learn more →
          </span>
        )}
      </CardContent>
    </Card>
  )

  if (showLink) {
    return (
      <Link href={`/services/${service.slug}`} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

export { services }

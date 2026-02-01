import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "Red White Reno transformed our dated kitchen into a modern masterpiece. The attention to detail was incredible, and they finished on time and on budget.",
    author: "Sarah M.",
    projectType: "Kitchen Renovation",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "We couldn't be happier with our new basement. It's now our favorite room in the house. Professional, courteous, and skilled craftsmen.",
    author: "Mike & Jennifer T.",
    projectType: "Basement Finishing",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "The bathroom renovation exceeded our expectations. The AI visualizer helped us pick the perfect tile combination before they even started work.",
    author: "David K.",
    projectType: "Bathroom Renovation",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "From the initial quote to the final walkthrough, everything was handled professionally. Highly recommend for any renovation project.",
    author: "Lisa R.",
    projectType: "Flooring Installation",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  )
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number]
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-6">
        {/* Star Rating */}
        <div className="flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="mt-4 flex-1 text-muted-foreground">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.projectType}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export { testimonials }

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "Red White Reno Inc. did an excellent job on the complete renovation of my bathroom. Michel and Clodagh are extremely attentive to the smallest detail and provide excellent information along the way to assist in decision-making. They and their workers are friendly, intelligent and courteous. The work was excellent, timely and well-priced.",
    author: "Justin O.",
    projectType: "Bathroom Renovation",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Michel & crew organized and accomplished converting our unfinished basement into additional comfortable living space. The workmanship, care for detail, and suggestions were excellent, and coordination and cooperation with other contractors was generous. When we needed changes to our original plans, the work proceeded cheerfully and quickly!",
    author: "Peter R.",
    projectType: "Basement Finishing",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "We couldn't have been more happy with the work done by Red White Reno Inc. Thoughtful planning and quoting, efficient timeline, mindful of budget, trustworthy and comfortable to have in our home amongst fantastic construction. We love our new space and know that it is so much more usable now, thanks to Michel & Clodagh!",
    author: "Kaleigh S.",
    projectType: "Home Renovation",
    rating: 5,
  },
  {
    id: 4,
    quote:
      "Michel does amazing work. I would highly recommend Red White Reno Inc.",
    author: "Marcus N.",
    projectType: "Renovation",
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

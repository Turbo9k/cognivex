import React from 'react'
import Image from 'next/image'

const testimonials = [
  {
    content: "This platform has completely transformed how our team collaborates. The real-time features and intuitive interface make it a joy to use.",
    author: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    image: "/placeholder.svg",
  },
  {
    content: "We've seen a 40% increase in productivity since switching to this platform. The automation features alone have saved us countless hours.",
    author: "Michael Chen",
    role: "CTO",
    company: "InnovateX",
    image: "/placeholder.svg",
  },
  {
    content: "The customer support is exceptional. Any time we've had questions, the team has been quick to respond and incredibly helpful.",
    author: "Emily Rodriguez",
    role: "Operations Director",
    company: "Global Solutions",
    image: "/placeholder.svg",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
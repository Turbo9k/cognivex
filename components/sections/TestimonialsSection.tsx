import React from 'react'
import Image from 'next/image'

const testimonials = [
  {
    content: "Notion has completely transformed how our team works together. It's the only tool we need.",
    author: {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    content: "The flexibility of Notion allows us to build exactly what we need, when we need it.",
    author: {
      name: 'Michael Rodriguez',
      role: 'Engineering Lead',
      company: 'InnovateX',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    content: "We've tried every tool out there, but Notion is the only one that truly adapts to our workflow.",
    author: {
      name: 'Emily Johnson',
      role: 'Marketing Director',
      company: 'GrowthLabs',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

export default function TestimonialsSection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by teams worldwide
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            See how teams of all sizes use Notion to work better together.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl bg-card p-8 shadow-sm ring-1 ring-gray-900/5"
            >
              <div>
                <p className="text-lg font-semibold leading-6 text-foreground">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-x-4">
                <Image
                  className="h-10 w-10 rounded-full bg-gray-50"
                  src={testimonial.author.image}
                  alt={testimonial.author.name}
                  width={40}
                  height={40}
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.author.role}, {testimonial.author.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
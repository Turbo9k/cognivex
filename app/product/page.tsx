import React from 'react'
import { CheckCircle } from 'lucide-react'
import Footer from '@/components/layout/Footer'

const features = [
  {
    title: 'AI-Powered Writing',
    description: 'Get help with writing, editing, and brainstorming with Notion AI.',
    icon: CheckCircle
  },
  {
    title: 'Connected Workspace',
    description: 'Keep all your work in one place with pages, databases, and more.',
    icon: CheckCircle
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time, from anywhere.',
    icon: CheckCircle
  },
  {
    title: 'Customizable Workspace',
    description: 'Tailor your workspace to your team\'s needs with flexible layouts and tools.',
    icon: CheckCircle
  }
]

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A better way to work together
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Notion brings all your work together in one place. From notes and docs to projects and wikis.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
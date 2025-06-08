import React from 'react'
import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: 'AI-Powered Writing',
    description: 'Get help with writing, editing, and brainstorming with intelligent automation.',
    icon: CheckCircle,
  },
  {
    title: 'Connected Workspace',
    description: 'Keep all your work in one place with pages, databases, and more.',
    icon: CheckCircle,
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time, from anywhere.',
    icon: CheckCircle,
  },
  {
    title: 'Customizable Workspace',
    description: "Tailor your workspace to your team's needs with flexible layouts and tools.",
    icon: CheckCircle,
  },
]

export default function FeaturesSection() {
  return (
    <div className="bg-background py-24 sm:py-32 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A better way to work together
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Cognivex brings all your work together in one place. From notes and docs to projects and wikis.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
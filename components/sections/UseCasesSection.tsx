import React from 'react'
import { Building2, Users, BookOpen, Lightbulb } from 'lucide-react'

const useCases = [
  {
    title: 'Enterprise',
    description: 'Transform how your company works with a single platform.',
    icon: Building2,
  },
  {
    title: 'Teams',
    description: 'Keep your team aligned and focused on what matters.',
    icon: Users,
  },
  {
    title: 'Education',
    description: 'Help students and teachers work together more effectively.',
    icon: BookOpen,
  },
  {
    title: 'Personal',
    description: 'Organize your life and work in one place.',
    icon: Lightbulb,
  },
]

export default function UseCasesSection() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Use cases for every team
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Cognivex adapts to your needs. Whether you're a team of 2 or 2,000, we've got you covered.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <useCase.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {useCase.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{useCase.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: 'Real-time Collaboration',
    description: 'Work together with your team in real-time with seamless synchronization.',
    icon: CheckCircle,
  },
  {
    title: 'Customizable Workspace',
    description: 'Tailor your workspace to your team\'s needs with flexible layouts and tools.',
    icon: CheckCircle,
  },
  {
    title: 'Advanced Security',
    description: 'Enterprise-grade security features to keep your data safe and compliant.',
    icon: CheckCircle,
  },
  {
    title: 'Analytics & Insights',
    description: 'Get detailed insights into your team\'s productivity and project progress.',
    icon: CheckCircle,
  },
  {
    title: 'Mobile Access',
    description: 'Access your workspace from any device, anywhere in the world.',
    icon: CheckCircle,
  },
  {
    title: 'Integrations',
    description: 'Connect with your favorite tools and services seamlessly.',
    icon: CheckCircle,
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Everything you need to work together
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Powerful features to help your team collaborate and achieve more.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
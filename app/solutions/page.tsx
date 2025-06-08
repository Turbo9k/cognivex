import React from 'react'
import { ArrowRight, Users, Building2, GraduationCap, Briefcase } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Solutions for</span>
              <span className="block text-primary">every team</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover how teams of all sizes use Cognivex to work better together.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <solution.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-foreground">{solution.title}</h3>
                      <p className="mt-2 text-muted-foreground">{solution.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={solution.href}
                      className="inline-flex items-center text-primary hover:text-primary/90"
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

const solutions = [
  {
    title: 'Enterprise',
    description: 'For large organizations that need advanced security, compliance, and support.',
    icon: Building2,
    href: '/solutions/enterprise',
  },
  {
    title: 'Small Business',
    description: 'For growing teams that need to stay organized and efficient.',
    icon: Briefcase,
    href: '/solutions/small-business',
  },
  {
    title: 'Education',
    description: 'For schools and universities to manage courses and collaborate.',
    icon: GraduationCap,
    href: '/solutions/education',
  },
  {
    title: 'Non-profit',
    description: 'For organizations making a difference in the world.',
    icon: Users,
    href: '/solutions/non-profit',
  },
] 
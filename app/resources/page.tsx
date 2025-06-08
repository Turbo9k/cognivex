import React from 'react'
import { Book, FileText, Users, Video, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/layout/Footer'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Resources to help</span>
              <span className="block text-primary">you succeed</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Guides, templates, and community content to help you get the most out of Cognivex.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <div
                key={resource.title}
                className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <resource.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-foreground">{resource.title}</h3>
                      <p className="mt-2 text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={resource.href}
                      className="inline-flex items-center text-primary hover:text-primary/90"
                    >
                      Explore
                      <resource.linkIcon className="ml-2 h-4 w-4" />
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

const resources = [
  {
    title: 'Guides & Tutorials',
    description: 'Step-by-step guides to help you master Cognivex.',
    icon: Book,
    linkIcon: FileText,
    href: '/resources/guides',
  },
  {
    title: 'Templates',
    description: 'Ready-to-use templates for any use case.',
    icon: FileText,
    linkIcon: FileText,
    href: '/resources/templates',
  },
  {
    title: 'Community',
    description: 'Connect with other Cognivex users and share ideas.',
    icon: Users,
    linkIcon: MessageSquare,
    href: '/resources/community',
  },
  {
    title: 'Video Tutorials',
    description: 'Watch video guides and tutorials.',
    icon: Video,
    linkIcon: Video,
    href: '/resources/videos',
  },
] 
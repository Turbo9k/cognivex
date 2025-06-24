'use client'

import React, { useState } from 'react'
import { CheckCircle, Star, Zap, Shield, Users, Globe, Clock } from 'lucide-react'
import Link from 'next/link'
import QuoteModal, { QuoteData } from '@/components/QuoteModal'
import Footer from '@/components/layout/Footer'

export default function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const handleQuoteSubmit = async (data: QuoteData) => {
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quote')
      }

      // Show success message or redirect
      alert('Thank you for your interest! We will contact you soon.')
    } catch (error) {
      console.error('Error submitting quote:', error)
      alert('Failed to submit quote. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Simple, transparent</span>
              <span className="block text-primary">pricing</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Choose the plan that's right for you and your team. All plans include our core features with no hidden fees.
            </p>
            
            {/* Pricing benefits */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-10 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`group relative bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background ${
                  plan.featured ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                )}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {plan.name}
                    </h3>
                    <p className="mt-4 text-muted-foreground">{plan.description}</p>
                    <p className="mt-8">
                      <span className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </p>
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                        What's included
                      </h4>
                      <ul className="mt-6 space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <div className="flex-shrink-0">
                              <CheckCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                            <p className="ml-3 text-base text-muted-foreground">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan.name)
                        setIsModalOpen(true)
                      }}
                      className={`w-full text-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium transition-colors ${
                        plan.featured
                          ? 'text-white bg-primary hover:bg-primary/90'
                          : 'text-primary bg-primary/10 hover:bg-primary/20'
                      }`}
                    >
                      Get started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">All plans come with a 30-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Do you offer discounts?</h3>
              <p className="text-muted-foreground">Yes, we offer 20% off for annual plans and special pricing for nonprofits and educational institutions.</p>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        onSubmit={handleQuoteSubmit}
      />
      <Footer />
    </div>
  )
}

const pricingPlans = [
  {
    name: 'Personal',
    description: 'Perfect for individuals and small projects.',
    price: '4',
    features: [
      'Unlimited pages and blocks',
      'Share with up to 5 guests',
      'Sync across devices',
      'Basic page analytics',
      '7-day page history',
      'Email support',
    ],
    featured: false,
  },
  {
    name: 'Team',
    description: 'Best for teams and growing companies.',
    price: '8',
    features: [
      'Everything in Personal',
      'Unlimited team members',
      'Collaborative workspace',
      'Advanced permissions',
      '30-day page history',
      'Admin tools',
      'Priority support',
      'Custom integrations',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs.',
    price: '15',
    features: [
      'Everything in Team',
      'Unlimited page history',
      'Advanced security',
      'SAML SSO',
      'Audit log',
      'Dedicated support',
      'Custom contract',
      'On-premise deployment',
    ],
    featured: false,
  },
] 
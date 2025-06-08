import React from 'react'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import UseCasesSection from '@/components/sections/UseCasesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'
import SocialProofSection from '@/components/sections/SocialProofSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <TestimonialsSection />
      <SocialProofSection />
      <CTASection />
      <CTASection variant="final" />
      <Footer />
    </div>
  )
}
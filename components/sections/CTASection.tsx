import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface CTASectionProps {
  variant?: 'default' | 'final'
}

export default function CTASection({ variant = 'default' }: CTASectionProps): JSX.Element {
  const isFinal = variant === 'final'
  
  return (
    <section className={`py-24 ${isFinal ? 'bg-gray-900' : 'bg-blue-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className={`text-3xl font-extrabold sm:text-4xl ${isFinal ? 'text-white' : 'text-white'}`}>
            {isFinal ? 'Ready to get started?' : 'Start your free trial today'}
          </h2>
          <p className={`mt-4 text-xl ${isFinal ? 'text-gray-300' : 'text-blue-100'}`}>
            {isFinal 
              ? 'Join thousands of teams already using our platform'
              : 'No credit card required. 14-day free trial.'}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
                isFinal 
                  ? 'text-gray-900 bg-white hover:bg-gray-100'
                  : 'text-blue-600 bg-white hover:bg-blue-50'
              }`}
            >
              Get started for free
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import EmailSubscription from './EmailSubscription'

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-4 sm:pb-32 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mt-8 sm:mt-12 lg:mt-8">
            <div className="inline-flex space-x-6 justify-center">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                <span>Just shipped v1.0</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Write, plan, share. With AI at your side.
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Notion is the connected workspace where better, faster work happens. Now with Q&A and writing assistance from Notion AI.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <div className="flex items-center -mt-3">
              <EmailSubscription />
            </div>
            <Link href="/product" className="text-sm font-semibold leading-6 text-foreground">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
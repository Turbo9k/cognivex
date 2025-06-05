import React from 'react'
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection(): JSX.Element {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Write, plan, share.
          <br />
          With AI at your side.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Notion is the connected workspace where better, faster work happens. Now with Q&A and writing assistance
          from Notion AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 whitespace-nowrap">
              Get started
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <Image
            src="/placeholder.svg?height=300&width=600"
            alt="Notion workspace preview"
            width={600}
            height={300}
            className="rounded-lg shadow-lg border border-gray-200 mx-auto"
          />
        </div>
        <p className="text-sm text-gray-500 mt-4">Free for teams up to 10. No credit card required.</p>
      </div>
    </section>
  )
}
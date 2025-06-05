import React from 'react'
import Image from 'next/image'

interface CompanyLogo {
  src: string
  alt: string
  width: number
  height: number
}

const companyLogos: CompanyLogo[] = [
  {
    src: "/placeholder.svg?height=40&width=120",
    alt: "Company logo",
    width: 120,
    height: 40
  },
  {
    src: "/placeholder.svg?height=40&width=120",
    alt: "Company logo",
    width: 120,
    height: 40
  },
  {
    src: "/placeholder.svg?height=40&width=120",
    alt: "Company logo",
    width: 120,
    height: 40
  },
  {
    src: "/placeholder.svg?height=40&width=120",
    alt: "Company logo",
    width: 120,
    height: 40
  }
]

export default function SocialProofSection(): JSX.Element {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-12">Trusted by teams at</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          {companyLogos.map((logo, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
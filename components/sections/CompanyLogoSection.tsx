import Link from 'next/link'

export default function CompanyLogoSection() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-center">
          <Link href="/" className="text-4xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600 hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            Notion
          </Link>
        </div>
      </div>
    </div>
  )
} 
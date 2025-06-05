import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

interface UseCase {
  title: string
  description: string
  image: string
}

interface CheckListItem {
  text: string
}

const useCases: UseCase[] = [
  {
    title: 'Project Management',
    description: 'Organize tasks, track progress, and collaborate with your team in real-time.',
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'Knowledge Base',
    description: 'Create a centralized hub for your team\'s documentation and resources.',
    image: '/placeholder.svg?height=300&width=400',
  },
  {
    title: 'Team Collaboration',
    description: 'Work together seamlessly with integrated tools and real-time updates.',
    image: '/placeholder.svg?height=300&width=400',
  },
]

const checkListItems: CheckListItem[] = [
  { text: "Create docs, wikis, and project plans in one place" },
  { text: "Track tasks and projects with custom databases" },
  { text: "Collaborate in real-time with your entire team" }
]

export default function UseCasesSection(): JSX.Element {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Every team, every use case</h2>
          <p className="text-lg text-gray-600">
            Notion adapts to your needs. It's as minimal or as powerful as you need it to be.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">For teams that want to move fast</h3>
            <div className="space-y-4">
              {checkListItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
            <Button className="mt-8 bg-gray-900 hover:bg-gray-800 text-white">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div>
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Team collaboration interface"
              width={500}
              height={400}
              className="rounded-lg border border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{useCase.title}</h3>
                <p className="mt-4 text-base text-gray-500">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
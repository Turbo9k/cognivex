import Link from "next/link"
import { Globe } from "lucide-react"

interface FooterSection {
  title: string
  links: {
    label: string
    href: string
  }[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "What's New", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Templates", href: "#" },
      { label: "API", href: "#" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy", href: "#" }
    ]
  }
]

export default function Footer(): JSX.Element {
  return (
    <footer className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-semibold text-foreground mb-4 block">
              Cognivex
            </Link>
            <p className="text-muted-foreground text-sm">A new tool that blends your everyday work apps into one.</p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2024 Cognivex, Inc.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">English</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 
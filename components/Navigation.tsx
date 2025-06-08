import Link from 'next/link';

const navigation = {
  main: [
    { name: 'Templates', href: '/templates' },
    { name: 'API', href: '/api' },
    { name: 'Resources', href: '/resources' },
    { name: 'Help Center', href: '/help' },
    { name: 'Guides', href: '/guides' },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Security', href: '/security' },
    { name: 'Privacy', href: '/privacy' },
  ],
};

export default function Navigation() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <nav className="mt-8 -mx-5 -my-2 flex flex-wrap justify-center" aria-label="Company">
          {navigation.company.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <Link href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
} 
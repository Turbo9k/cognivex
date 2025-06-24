import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cognivex - Connected Workspace',
  description: 'Write, plan, share. With AI at your side.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var currentTheme = theme || systemTheme;
                  
                  // Apply theme immediately to prevent flash
                  document.documentElement.classList.toggle('dark', currentTheme === 'dark');
                  
                  // Save theme if not already saved
                  if (!theme) {
                    localStorage.setItem('theme', currentTheme);
                  }
                } catch (e) {
                  // Fallback to system theme
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', systemTheme === 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
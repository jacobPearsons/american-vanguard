import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import ModalProvider from '@/providers/modal-provider'
import { Toaster } from '@/components/ui/sonner'
import { UserProvider } from '@/providers/user-provider'

export const metadata: Metadata = {
  title: 'American Vanguard Institute - Excellence in Education',
  description: 'Discover world-class education at American Vanguard Institute. Explore our programs, admissions, research, and campus life.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AVI Student',
  },
}

export const viewport: Viewport = {
  themeColor: '#eab308',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              <ModalProvider>
                {children}
                <Toaster />
              </ModalProvider>
            </UserProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

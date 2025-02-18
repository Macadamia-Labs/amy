import { TooltipProvider } from '@/components/ui/tooltip'
import AuthProvider from '@/lib/providers/auth-provider'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import '@/styles/prosemirror.css'
import '@/styles/xy-theme.css'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from 'sonner'

interface RootLayoutProps {
  children: React.ReactNode
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Amy'
const description = 'AI Platform for Complex Engineering Projects'

export const metadata: Metadata = {
  metadataBase: new URL('https://macadamialabs.com'),
  title,
  description,
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@macadamialabs'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('font-sans h-screen flex flex-col', fontSans.variable)}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            themes={['light', 'dark', 'sunlight', 'sunset']}
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

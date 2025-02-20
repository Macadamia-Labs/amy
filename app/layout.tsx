import { TooltipProvider } from '@/components/ui/tooltip'
import AuthProvider from '@/lib/providers/auth-provider'
import { createClient } from '@/lib/supabase/server'

import { cn } from '@/lib/utils/helpers'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Macadamia',
  description: 'AI Copilot for Mechanical Engineering'
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('font-sans h-screen flex flex-col', fontSans.variable)}
      >
        <AuthProvider serverSession={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            themes={['light', 'dark', 'sunlight', 'sunset']}
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

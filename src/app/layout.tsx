import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'LexFlow — AI Systems for UK Law Firms',
  description:
    'We install AI systems that give UK immigration and conveyancing law firms 10+ hours back per week.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'

// Public marketing page — self-referencing canonical (page itself is a client component).
export const metadata: Metadata = {
  alternates: { canonical: '/demo' },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children
}

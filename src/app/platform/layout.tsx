import type { Metadata } from 'next'

// Platform admin area must never be indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import DashboardLayoutClient from './DashboardLayoutClient'

// Tenant dashboard must never be indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}

import type { Metadata } from 'next'
import AdminLayoutClient from './AdminLayoutClient'

// Admin area must never be indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}

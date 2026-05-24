'use client'
import { SessionProvider } from 'next-auth/react'

// Note: the root layout already wraps the app in SessionProvider via
// src/components/Providers.tsx. This file is kept for future use if
// the admin section ever needs its own session config.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

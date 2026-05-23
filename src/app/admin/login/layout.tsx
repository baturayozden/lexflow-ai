import type { ReactNode } from 'react'

// Override the admin layout so the login page has no nav bar
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

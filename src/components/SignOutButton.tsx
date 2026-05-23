'use client'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-white/40 hover:text-white text-sm transition-colors px-3 py-1 border border-white/10 rounded-lg hover:border-white/30"
    >
      Sign out
    </button>
  )
}

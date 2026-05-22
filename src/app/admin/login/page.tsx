'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) router.push('/admin')
    else setError('Invalid credentials')
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[#c9a84c] font-bold text-2xl">Lex</span>
          <span className="text-white font-bold text-2xl">Flow</span>
          <p className="text-white/40 text-sm mt-2">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-[#c9a84c] text-[#0a1628] font-bold py-3 rounded-lg">Sign In</button>
        </form>
      </div>
    </div>
  )
}

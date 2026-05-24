'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TenantLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[#c9a84c] font-bold text-3xl">Lex</span>
          <span className="text-white font-bold text-3xl">Flow</span>
          <p className="text-white/40 text-sm mt-2">Sign in to your firm dashboard</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@yourfirm.co.uk"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-[#0a1628] font-bold py-3 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-white/20 text-xs text-center mt-6">
            Forgot your password? Contact your administrator.
          </p>
        </div>
        <p className="text-white/20 text-xs text-center mt-4">
          Powered by <span className="text-[#c9a84c]">LexFlow</span>
        </p>
      </div>
    </div>
  )
}

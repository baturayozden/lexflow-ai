'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PLANS = [
  { value: 'quick_win', label: 'Quick Win — £997' },
  { value: 'full_setup', label: 'Full Setup — £2,500' },
  { value: 'retainer', label: 'Retainer — £1,500/mo' },
]

export default function NewFirmPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: 'quick_win' })
  const [adminUser, setAdminUser] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const firmRes = await fetch('/api/firms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const firm = await firmRes.json()
      if (!firmRes.ok) throw new Error(firm.error || 'Failed to create firm')

      if (adminUser.email && adminUser.password) {
        const userRes = await fetch(`/api/firms/${firm.id}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...adminUser, role: 'managing_partner' }),
        })
        if (!userRes.ok) {
          const err = await userRes.json()
          throw new Error(err.error || 'Failed to create user')
        }
      }

      router.push('/platform')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a href="/platform" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Platform
          </a>
          <h1 className="text-white font-bold text-xl">Add Client Firm</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Firm details */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">
              Firm Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-white/40 text-xs block mb-1.5">Firm Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  placeholder="Smith & Associates"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={inputClass}
                  placeholder="hello@smithlaw.co.uk"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="text-white/40 text-xs block mb-1.5">Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))}
                  className={inputClass}
                >
                  {PLANS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Managing partner login */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-2">
              Managing Partner Login
            </p>
            <p className="text-white/30 text-xs mb-4">
              Create login credentials for the firm&apos;s managing partner. They will use these to
              access their dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-white/40 text-xs block mb-1.5">Full Name</label>
                <input
                  value={adminUser.name}
                  onChange={(e) => setAdminUser((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Email</label>
                <input
                  type="email"
                  value={adminUser.email}
                  onChange={(e) => setAdminUser((p) => ({ ...p, email: e.target.value }))}
                  className={inputClass}
                  placeholder="jane@smithlaw.co.uk"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Temporary Password</label>
                <input
                  type="password"
                  value={adminUser.password}
                  onChange={(e) => setAdminUser((p) => ({ ...p, password: e.target.value }))}
                  className={inputClass}
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <a
              href="/platform"
              className="flex-1 border border-white/10 text-white/60 py-3 rounded-xl text-sm text-center hover:border-white/30 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-3 rounded-xl text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create Firm & User →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

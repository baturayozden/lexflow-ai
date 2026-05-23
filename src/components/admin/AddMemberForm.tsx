'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddMemberForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('associate')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add member')
      setName('')
      setEmail('')
      setRole('associate')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

  return (
    <form onSubmit={handleSubmit} className="bg-white/2 border border-white/10 rounded-xl p-5">
      <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Add Team Member</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
        >
          <option value="admin">Admin</option>
          <option value="associate">Associate</option>
          <option value="paralegal">Paralegal</option>
        </select>
      </div>
      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-[#c9a84c] text-[#0a1628] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors disabled:opacity-40"
      >
        {submitting ? 'Adding…' : 'Add Member'}
      </button>
    </form>
  )
}

'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const ROLES = [
  { value: 'managing_partner', label: 'Managing Partner' },
  { value: 'senior_solicitor', label: 'Senior Solicitor' },
  { value: 'associate_solicitor', label: 'Associate Solicitor' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'receptionist', label: 'Receptionist' },
]

const ROLE_LABELS: Record<string, string> = {
  managing_partner: 'Managing Partner',
  senior_solicitor: 'Senior Solicitor',
  associate_solicitor: 'Associate Solicitor',
  paralegal: 'Paralegal',
  receptionist: 'Receptionist',
}

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  last_login_at: string | null
}

export default function DashboardTeamPage() {
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session?.user as any)?.firmId
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'associate_solicitor' })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [resetEmail, setResetEmail] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    if (firmId) {
      fetch(`/api/firms/${firmId}/users`)
        .then(r => r.json())
        .then(data => { setUsers(data || []); setLoading(false) })
    }
  }, [firmId])

  async function addUser() {
    if (!form.name || !form.email || !form.password) { setError('All fields required'); return }
    setAdding(true)
    setError('')
    const res = await fetch(`/api/firms/${firmId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const user = await res.json()
      setUsers(prev => [user, ...prev])
      setForm({ name: '', email: '', password: '', role: 'associate_solicitor' })
      setShowAdd(false)
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to add user')
    }
    setAdding(false)
  }

  async function toggleActive(userId: string, active: boolean) {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !active } : u))
  }

  async function deleteUserConfirm(userId: string) {
    await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== userId))
    setConfirmDelete(null)
  }

  async function sendPasswordReset(email: string) {
    setResetEmail(email)
    await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setTimeout(() => setResetEmail(null), 3000)
  }

  if (loading) return <div className="p-8 text-white/40">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white font-bold text-xl">Team Members</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors">
          + Add Member
        </button>
      </div>

      {showAdd && (
        <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-6 mb-6">
          <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">New Team Member</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Temporary password" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50">
              {ROLES.map(r => <option key={r.value} value={r.value} className="bg-[#0a1628]">{r.label}</option>)}
            </select>
          </div>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setShowAdd(false)} className="border border-white/10 text-white/50 px-4 py-2 rounded-lg text-sm hover:border-white/30 transition-colors">Cancel</button>
            <button onClick={addUser} disabled={adding} className="bg-[#c9a84c] text-[#0a1628] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50">
              {adding ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">NAME</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">EMAIL</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">ROLE</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">STATUS</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">LAST LOGIN</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/2">
                <td className="px-6 py-4 text-white font-medium text-sm">{u.name}</td>
                <td className="px-6 py-4 text-white/50 text-sm">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="text-white/50 text-sm">{ROLE_LABELS[u.role] || u.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/30 text-sm">
                  {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('en-GB') : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 justify-end items-center">
                    <button
                      onClick={() => sendPasswordReset(u.email)}
                      className="text-[#c9a84c]/60 text-xs hover:text-[#c9a84c] transition-colors"
                    >
                      {resetEmail === u.email ? '✓ Sent' : 'Reset'}
                    </button>
                    <button
                      onClick={() => toggleActive(u.id, u.active)}
                      className={`text-xs transition-colors ${u.active ? 'text-yellow-400/50 hover:text-yellow-400' : 'text-green-400/50 hover:text-green-400'}`}
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                    {confirmDelete === u.id ? (
                      <span className="flex gap-2 items-center">
                        <span className="text-red-400 text-xs">Sure?</span>
                        <button onClick={() => deleteUserConfirm(u.id)} className="text-red-400 text-xs font-medium hover:underline">Yes</button>
                        <button onClick={() => setConfirmDelete(null)} className="text-white/30 text-xs hover:underline">No</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(u.id)}
                        className="text-red-400/40 text-xs hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!users.length && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-white/30 text-sm">No team members yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

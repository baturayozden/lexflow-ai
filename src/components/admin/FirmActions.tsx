'use client'
import { useState } from 'react'

const ROLES = [
  { value: 'managing_partner', label: 'Managing Partner' },
  { value: 'senior_solicitor', label: 'Senior Solicitor' },
  { value: 'associate_solicitor', label: 'Associate Solicitor' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'receptionist', label: 'Receptionist' },
]

const inputClass = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

export function FirmActions({ firmId }: { firmId: string }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'associate_solicitor' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function addUser() {
    if (!form.name || !form.email || !form.password) return
    setLoading(true)
    const res = await fetch(`/api/firms/${firmId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSuccess(true)
      setForm({ name: '', email: '', password: '', role: 'associate_solicitor' })
      setTimeout(() => { setSuccess(false); setShowAdd(false); window.location.reload() }, 1500)
    }
    setLoading(false)
  }

  if (!showAdd) {
    return (
      <button
        onClick={() => setShowAdd(true)}
        className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs px-3 py-2 rounded-lg hover:bg-[#c9a84c]/20 transition-colors"
      >
        + Add User
      </button>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4 w-full">
      <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">Add New User</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="Full name"
          className={inputClass}
        />
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="Email"
          className={inputClass}
        />
        <input
          type="password"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          placeholder="Password"
          className={inputClass}
        />
        <select
          value={form.role}
          onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
          className={inputClass}
        >
          {ROLES.map(r => (
            <option key={r.value} value={r.value} className="bg-[#0a1628]">{r.label}</option>
          ))}
        </select>
      </div>
      {success ? (
        <div className="text-green-400 text-sm">✓ User added successfully</div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setShowAdd(false)}
            className="border border-white/10 text-white/50 text-sm px-4 py-2 rounded-lg hover:border-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addUser}
            disabled={loading}
            className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding…' : 'Add User'}
          </button>
        </div>
      )}
    </div>
  )
}

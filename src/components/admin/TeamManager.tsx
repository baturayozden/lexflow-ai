'use client'
import { useState } from 'react'

const ROLES = [
  { value: 'managing_partner', label: 'Managing Partner' },
  { value: 'senior_solicitor', label: 'Senior Solicitor' },
  { value: 'associate_solicitor', label: 'Associate Solicitor' },
  { value: 'paralegal', label: 'Paralegal' },
  { value: 'receptionist', label: 'Receptionist' },
]

const roleColors: Record<string, string> = {
  managing_partner: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  senior_solicitor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  associate_solicitor: 'bg-green-500/10 text-green-400 border-green-500/20',
  paralegal: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  receptionist: 'bg-white/5 text-white/50 border-white/10',
}

interface Member {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export function TeamManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [form, setForm] = useState({ name: '', email: '', role: 'associate_solicitor' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' })
  const [loading, setLoading] = useState(false)

  async function addMember() {
    if (!form.name || !form.email) return
    setLoading(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.member) setMembers((prev) => [...prev, data.member])
      setForm({ name: '', email: '', role: 'associate_solicitor' })
    } finally {
      setLoading(false)
    }
  }

  function startEdit(member: Member) {
    setEditingId(member.id)
    setEditForm({ name: member.name, email: member.email, role: member.role })
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/team/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const updated = await res.json()
    setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)))
    setEditingId(null)
  }

  async function removeMember(id: string) {
    await fetch(`/api/team/${id}`, { method: 'DELETE' })
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div>
      {/* Add Member Form */}
      <div className="bg-white/2 border border-white/10 rounded-xl p-6 mb-8">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Add Team Member</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
          />
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email address"
            type="email"
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addMember}
          disabled={loading}
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#f0d080] transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding…' : 'Add Member'}
        </button>
      </div>

      {/* Members List */}
      <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">NAME</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">EMAIL</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">ROLE</th>
              <th className="text-left text-white/40 text-xs font-medium px-6 py-3">JOINED</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                {editingId === m.id ? (
                  <>
                    <td className="px-6 py-3">
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm w-full"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <input
                        value={editForm.email}
                        onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                        className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm w-full"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                        className="bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => saveEdit(m.id)}
                          className="text-[#c9a84c] text-xs hover:text-[#f0d080] transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-white/30 text-xs hover:text-white/60 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3 text-white font-medium text-sm">{m.name}</td>
                    <td className="px-6 py-3 text-white/50 text-sm">{m.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          roleColors[m.role] || 'bg-white/5 text-white/40 border-white/10'
                        }`}
                      >
                        {ROLES.find((r) => r.value === m.role)?.label || m.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white/30 text-sm">
                      {new Date(m.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => startEdit(m)}
                          className="text-white/30 text-xs hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeMember(m.id)}
                          className="text-red-400/50 text-xs hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {!members.length && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/30 text-sm">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

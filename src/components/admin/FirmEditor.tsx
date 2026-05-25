'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Firm {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  website?: string | null
  address?: string | null
  plan: string
  primary_color?: string | null
  active: boolean
}

const PLANS = [
  { value: 'starter', label: 'Starter' },
  { value: 'quick_win', label: 'Quick Win — £997' },
  { value: 'full_setup', label: 'Full Setup — £2,500' },
  { value: 'retainer', label: 'Retainer — £1,500/mo' },
]

export function FirmEditor({ firm }: { firm: Firm }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: firm.name || '',
    email: firm.email || '',
    phone: firm.phone || '',
    website: firm.website || '',
    address: firm.address || '',
    plan: firm.plan || 'starter',
    primary_color: firm.primary_color || '#c9a84c',
    active: firm.active,
  })

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/firms/${firm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Save failed')
        return
      }
      setOpen(false)
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      const res = await fetch(`/api/firms/${firm.id}`, { method: 'DELETE' })
      if (!res.ok) { setError('Delete failed'); return }
      router.push('/admin/firms')
    } catch {
      setError('Network error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 border border-white/20 text-white/60 rounded-lg hover:border-[#c9a84c]/40 hover:text-white transition-colors"
      >
        Edit Firm
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Edit Firm</h2>
              <button onClick={() => { setOpen(false); setConfirmDelete(false); setError('') }} className="text-white/40 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Firm Name</label>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none"
                />
              </div>

              {/* Plan */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Plan</label>
                <select
                  value={form.plan}
                  onChange={e => set('plan', e.target.value)}
                  className="w-full bg-[#0a1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none"
                >
                  {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              {/* Email / Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Website</label>
                <input
                  value={form.website}
                  onChange={e => set('website', e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Address</label>
                <textarea
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none resize-none"
                />
              </div>

              {/* Brand Color + Active toggle */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-white/40 text-xs mb-1 block">Brand Colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primary_color}
                      onChange={e => set('primary_color', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      value={form.primary_color}
                      onChange={e => set('primary_color', e.target.value)}
                      className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#c9a84c]/50 focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Status</label>
                  <button
                    type="button"
                    onClick={() => set('active', !form.active)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.active
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {form.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold text-sm py-2.5 rounded-lg hover:bg-[#f0d080] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`text-sm px-4 py-2.5 rounded-lg border transition-colors ${
                  confirmDelete
                    ? 'bg-red-500/20 border-red-500/40 text-red-400 font-semibold'
                    : 'border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400'
                }`}
              >
                {deleting ? 'Deleting…' : confirmDelete ? 'Confirm Delete?' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

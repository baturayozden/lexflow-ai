'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  firm_name?: string
  firm_type?: string
  message?: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-green-500/10 text-green-400 border-green-500/20',
  converted: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  lost: 'bg-white/5 text-white/30 border-white/10',
}

interface LeadsViewProps {
  leads: Lead[]
  firmId: string
  firmName: string
}

export function LeadsView({ leads, firmId, firmName }: LeadsViewProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    firm_type: '',
    message: '',
  })

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch =
        !search ||
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.phone?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !filterStatus || l.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [leads, search, filterStatus])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) {
      setFormError('Name and email are required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          firm_name: firmName,
          firm_type: form.firm_type || 'Not specified',
          message: form.message || undefined,
          firm_id: firmId,
        }),
      })
      if (!res.ok) throw new Error('Failed to save lead')
      setForm({ name: '', email: '', phone: '', firm_type: '', message: '' })
      setShowForm(false)
      router.refresh()
    } catch {
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Leads</h1>
          <p className="text-white/40 text-sm mt-0.5">{leads.length} total</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Lead'}
        </button>
      </div>

      {/* Manual lead creation form */}
      {showForm && (
        <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold text-sm mb-4">Add New Lead</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+44 7700 900123"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Service Needed (optional)</label>
                <input
                  type="text"
                  value={form.firm_type}
                  onChange={e => setForm(f => ({ ...f, firm_type: e.target.value }))}
                  placeholder="e.g. Skilled Worker Visa"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Notes (optional)</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3}
                placeholder="Any initial notes about this lead…"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
              />
            </div>
            {formError && (
              <p className="text-red-400 text-xs">{formError}</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError('') }}
                className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Add Lead →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Leads list */}
      <div className="space-y-2">
        {filtered.map(l => (
          <Link
            key={l.id}
            href={`/dashboard/leads/${l.id}`}
            className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-white font-medium">{l.name}</div>
                <div className="text-white/40 text-sm mt-0.5">
                  {l.email}
                  {l.phone && <span className="ml-2 text-white/25">{l.phone}</span>}
                </div>
                {l.firm_type && l.firm_type !== 'Not specified' && (
                  <div className="text-white/30 text-xs mt-1">{l.firm_type}</div>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <div className="text-white/25 text-xs hidden sm:block">
                  {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[l.status] || 'bg-white/5 text-white/30 border-white/10'}`}>
                  {l.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {!filtered.length && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">
              {search || filterStatus ? 'No leads match your filters.' : 'No leads yet.'}
            </p>
            {!search && !filterStatus && (
              <button
                onClick={() => setShowForm(true)}
                className="text-[#c9a84c] text-xs mt-2 hover:underline"
              >
                Add your first lead →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

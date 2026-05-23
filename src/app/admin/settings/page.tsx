'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FirmSettings {
  firm_name?: string
  primary_color?: string
  website?: string
  phone?: string
  logo_url?: string
  address?: string
}

interface EmailSettings {
  from_name?: string
  from_email?: string
  reply_to?: string
}

interface ChecklistTemplate {
  id: string
  case_type: string
  title: string
  items: string[]
}

interface QuoteTemplate {
  id: string
  case_type: string
  min_fee: number
  max_fee: number
  currency: string
  home_office_fee?: number
  notes?: string
}

interface EditingChecklist extends ChecklistTemplate {
  editItems: string[]
}

export default function SettingsPage() {
  const [firmSettings, setFirmSettings] = useState<FirmSettings>({})
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({})
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>([])
  const [quotes, setQuotes] = useState<QuoteTemplate[]>([])
  const [activeTab, setActiveTab] = useState('firm')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingChecklist, setEditingChecklist] = useState<EditingChecklist | null>(null)
  const [editingQuote, setEditingQuote] = useState<QuoteTemplate | null>(null)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/settings/firm').then((r) => { if (r.status === 401) { router.push('/admin/login'); throw new Error('Unauthorized') } return r.json() }),
      fetch('/api/settings/email').then((r) => r.json()),
      fetch('/api/settings/checklists').then((r) => r.json()),
      fetch('/api/settings/quotes').then((r) => r.json()),
    ])
      .then(([firm, email, cl, qt]) => {
        setFirmSettings(firm || {})
        setEmailSettings(email || {})
        setChecklists(cl || [])
        setQuotes(qt || [])
      })
      .catch(() => {})
  }, [router])

  async function saveFirm() {
    setSaving(true)
    await fetch('/api/settings/firm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firmSettings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveEmail() {
    setSaving(true)
    await fetch('/api/settings/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailSettings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveChecklist(id: string, items: string[]) {
    await fetch('/api/settings/checklists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, items }),
    })
    setEditingChecklist(null)
    const updated = await fetch('/api/settings/checklists').then((r) => r.json())
    setChecklists(updated)
  }

  async function saveQuote(id: string, data: Partial<QuoteTemplate>) {
    await fetch('/api/settings/quotes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    setEditingQuote(null)
    const updated = await fetch('/api/settings/quotes').then((r) => r.json())
    setQuotes(updated)
  }

  const tabs = [
    { id: 'firm', label: 'Firm Profile' },
    { id: 'email', label: 'Email Settings' },
    { id: 'checklists', label: 'Document Checklists' },
    { id: 'quotes', label: 'Fee Quotes' },
  ]

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white font-bold text-xl mb-8">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#c9a84c] text-[#0a1628] font-semibold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {saved && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center text-green-400 text-sm mb-4">
            ✓ Saved successfully
          </div>
        )}

        {/* ── Firm Profile ── */}
        {activeTab === 'firm' && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-6 space-y-4">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">Firm Profile</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Firm Name</label>
                <input
                  value={firmSettings.firm_name || ''}
                  onChange={(e) => setFirmSettings((p) => ({ ...p, firm_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Brand Color (hex)</label>
                <div className="flex gap-2">
                  <input
                    value={firmSettings.primary_color || '#c9a84c'}
                    onChange={(e) => setFirmSettings((p) => ({ ...p, primary_color: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                  />
                  <input
                    type="color"
                    value={firmSettings.primary_color || '#c9a84c'}
                    onChange={(e) => setFirmSettings((p) => ({ ...p, primary_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Website</label>
                <input
                  value={firmSettings.website || ''}
                  onChange={(e) => setFirmSettings((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://yourfirm.co.uk"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Phone</label>
                <input
                  value={firmSettings.phone || ''}
                  onChange={(e) => setFirmSettings((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="text-white/40 text-xs block mb-1.5">Logo URL</label>
                <input
                  value={firmSettings.logo_url || ''}
                  onChange={(e) => setFirmSettings((p) => ({ ...p, logo_url: e.target.value }))}
                  placeholder="https://yourfirm.co.uk/logo.png"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className="text-white/40 text-xs block mb-1.5">Address</label>
                <textarea
                  value={firmSettings.address || ''}
                  onChange={(e) => setFirmSettings((p) => ({ ...p, address: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none"
                />
              </div>
            </div>
            <button
              onClick={saveFirm}
              disabled={saving}
              className="bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Firm Profile'}
            </button>
          </div>
        )}

        {/* ── Email Settings ── */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="bg-white/2 border border-white/10 rounded-xl p-6 space-y-4">
              <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">Email Sender Settings</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 text-xs block mb-1.5">From Name</label>
                  <input
                    value={emailSettings.from_name || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, from_name: e.target.value }))}
                    placeholder="Smith & Associates"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs block mb-1.5">From Email</label>
                  <input
                    value={emailSettings.from_email || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, from_email: e.target.value }))}
                    placeholder="hello@smithlaw.co.uk"
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-white/40 text-xs block mb-1.5">Reply-To Email</label>
                  <input
                    value={emailSettings.reply_to || ''}
                    onChange={(e) => setEmailSettings((p) => ({ ...p, reply_to: e.target.value }))}
                    placeholder="enquiries@smithlaw.co.uk"
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                onClick={saveEmail}
                disabled={saving}
                className="bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Email Settings'}
              </button>
            </div>

            {/* Domain setup guide */}
            <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">
                Custom Domain Setup
              </p>
              <p className="text-white/60 text-sm mb-4">
                Send emails from your own domain (e.g. hello@yourfirm.co.uk). Follow these steps:
              </p>
              <ol className="space-y-3">
                {[
                  { step: 'Create a free Resend account', detail: <a href="https://resend.com" target="_blank" className="text-[#c9a84c] text-xs hover:underline" rel="noreferrer">resend.com →</a> },
                  { step: 'Add your domain in Resend → Domains', detail: <span className="text-white/40 text-xs">Enter your firm's domain and follow their DNS verification steps</span> },
                  { step: 'Create an API key in Resend → API Keys', detail: <span className="text-white/40 text-xs">Share it with us and we'll connect it to your account</span> },
                  { step: 'Update your From Email above', detail: <span className="text-white/40 text-xs">Use your verified domain email address</span> },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-5 h-5 bg-[#c9a84c] text-[#0a1628] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.step}</p>
                      {item.detail}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4 bg-white/5 rounded-lg p-3">
                <p className="text-white/40 text-xs">
                  Need help? Contact{' '}
                  <a href="mailto:hello@lexflow.co.uk" className="text-[#c9a84c]">
                    hello@lexflow.co.uk
                  </a>{' '}
                  and we will set this up for you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Checklists ── */}
        {activeTab === 'checklists' && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm mb-4">
              Edit the document checklists sent to clients for each case type.
            </p>
            {checklists.map((cl) => (
              <div key={cl.id} className="bg-white/2 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{cl.case_type}</h3>
                  {editingChecklist?.id !== cl.id ? (
                    <button
                      onClick={() => setEditingChecklist({ ...cl, editItems: [...(cl.items || [])] })}
                      className="text-[#c9a84c] text-xs hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveChecklist(cl.id, editingChecklist.editItems)}
                        className="text-[#c9a84c] text-xs hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingChecklist(null)}
                        className="text-white/30 text-xs hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {editingChecklist?.id === cl.id ? (
                  <div className="space-y-2">
                    {editingChecklist.editItems.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={item}
                          onChange={(e) =>
                            setEditingChecklist((p) => {
                              if (!p) return p
                              const items = [...p.editItems]
                              items[i] = e.target.value
                              return { ...p, editItems: items }
                            })
                          }
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                        />
                        <button
                          onClick={() =>
                            setEditingChecklist((p) =>
                              p ? { ...p, editItems: p.editItems.filter((_, j) => j !== i) } : p
                            )
                          }
                          className="text-red-400/50 hover:text-red-400 text-lg px-2 leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditingChecklist((p) =>
                          p ? { ...p, editItems: [...p.editItems, ''] } : p
                        )
                      }
                      className="text-[#c9a84c] text-xs hover:underline"
                    >
                      + Add item
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {(cl.items || []).map((item, i) => (
                      <li key={i} className="text-white/50 text-sm flex gap-2">
                        <span className="text-[#c9a84c] flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Quotes ── */}
        {activeTab === 'quotes' && (
          <div className="space-y-3">
            <p className="text-white/40 text-sm mb-4">
              Edit fee estimates sent to clients for each case type.
            </p>
            {quotes.map((qt) => (
              <div key={qt.id} className="bg-white/2 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{qt.case_type}</h3>
                  {editingQuote?.id !== qt.id ? (
                    <button
                      onClick={() => setEditingQuote({ ...qt })}
                      className="text-[#c9a84c] text-xs hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveQuote(qt.id, editingQuote)}
                        className="text-[#c9a84c] text-xs hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingQuote(null)}
                        className="text-white/30 text-xs hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {editingQuote?.id === qt.id ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/40 text-xs block mb-1">Min Fee (£)</label>
                      <input
                        type="number"
                        value={editingQuote.min_fee}
                        onChange={(e) =>
                          setEditingQuote((p) => p ? { ...p, min_fee: parseInt(e.target.value) || 0 } : p)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs block mb-1">Max Fee (£)</label>
                      <input
                        type="number"
                        value={editingQuote.max_fee}
                        onChange={(e) =>
                          setEditingQuote((p) => p ? { ...p, max_fee: parseInt(e.target.value) || 0 } : p)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs block mb-1">Home Office Fee (£)</label>
                      <input
                        type="number"
                        value={editingQuote.home_office_fee || ''}
                        onChange={(e) =>
                          setEditingQuote((p) =>
                            p ? { ...p, home_office_fee: parseInt(e.target.value) || undefined } : p
                          )
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs block mb-1">Currency</label>
                      <select
                        value={editingQuote.currency}
                        onChange={(e) =>
                          setEditingQuote((p) => p ? { ...p, currency: e.target.value } : p)
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                      >
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-white/40 text-xs block mb-1">Notes</label>
                      <textarea
                        value={editingQuote.notes || ''}
                        onChange={(e) =>
                          setEditingQuote((p) => p ? { ...p, notes: e.target.value } : p)
                        }
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <span className="text-white/40 text-xs">Professional fee</span>
                      <p className="text-white font-semibold">
                        £{qt.min_fee?.toLocaleString()} – £{qt.max_fee?.toLocaleString()}
                      </p>
                    </div>
                    {qt.home_office_fee && (
                      <div>
                        <span className="text-white/40 text-xs">Home Office fee</span>
                        <p className="text-white font-semibold">£{qt.home_office_fee?.toLocaleString()}</p>
                      </div>
                    )}
                    {qt.notes && (
                      <div className="flex-1">
                        <span className="text-white/40 text-xs">Notes</span>
                        <p className="text-white/60 text-sm">{qt.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

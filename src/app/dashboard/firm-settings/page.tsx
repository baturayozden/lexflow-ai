'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface FirmSettings {
  name?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  logo_url?: string
  primary_color?: string
}

interface EmailSettings {
  from_name?: string
  reply_to?: string
}

interface NotifPrefs {
  new_case_email: boolean
  new_lead_email: boolean
  high_priority_email: boolean
  daily_digest: boolean
  weekly_summary: boolean
}

function NotificationSettings({ firmId }: { firmId: string }) {
  const [prefs, setPrefs] = useState<NotifPrefs>({
    new_case_email: true,
    new_lead_email: true,
    high_priority_email: true,
    daily_digest: false,
    weekly_summary: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    await fetch('/api/settings/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firmId, prefs }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggles: { key: keyof NotifPrefs; label: string; description: string }[] = [
    { key: 'new_case_email',      label: 'New case submitted',   description: 'Email when a client submits an intake form' },
    { key: 'new_lead_email',      label: 'New lead added',       description: 'Email when a new lead is recorded' },
    { key: 'high_priority_email', label: 'High priority actions', description: 'Email when a case has urgent actions' },
    { key: 'daily_digest',        label: 'Daily digest',         description: 'Summary of today\'s activity each morning' },
    { key: 'weekly_summary',      label: 'Weekly summary',       description: 'Overview of the week every Monday' },
  ]

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-6 space-y-4">
      <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">Notification Preferences</p>
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center text-green-400 text-sm">✓ Saved</div>
      )}
      <div className="space-y-3">
        {toggles.map(t => (
          <div key={t.key} className="flex items-center justify-between p-3 bg-white/2 rounded-lg border border-white/5">
            <div>
              <div className="text-white text-sm font-medium">{t.label}</div>
              <div className="text-white/40 text-xs">{t.description}</div>
            </div>
            <button
              onClick={() => setPrefs(p => ({ ...p, [t.key]: !p[t.key] }))}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${prefs[t.key] ? 'bg-[#c9a84c]' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[t.key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  )
}

export default function FirmSettingsPage() {
  const { data: session } = useSession()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session?.user as any)?.firmId as string | undefined
  const [settings, setSettings] = useState<FirmSettings>({})
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('branding')

  useEffect(() => {
    console.log('[FirmSettings] useEffect fired — firmId:', firmId, '| session:', session?.user)
    if (!firmId) {
      // Session might still be loading — wait for firmId before giving up
      return
    }
    Promise.all([
      fetch(`/api/firms/${firmId}`).then(r => r.json()).catch((e) => { console.error('[FirmSettings] /api/firms fetch error:', e); return {} }),
      fetch('/api/settings/email').then(r => r.json()).catch((e) => { console.error('[FirmSettings] /api/settings/email fetch error:', e); return {} }),
    ]).then(([firm, email]) => {
      console.log('[FirmSettings] /api/firms response:', firm)
      console.log('[FirmSettings] /api/settings/email response:', email)
      // Guard against error objects returned by the API
      setSettings(firm?.error ? {} : (firm || {}))
      setEmailSettings(email?.error ? {} : (email || {}))
      setLoading(false)
    })
  }, [firmId, session])

  async function saveBranding() {
    if (!firmId) return
    setSaving(true)
    await fetch(`/api/firms/${firmId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        website: settings.website,
        logo_url: settings.logo_url,
        primary_color: settings.primary_color,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function saveEmailSettings() {
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

  if (loading && !firmId) return <div className="p-8 text-white/40">Loading session...</div>
  if (loading) return <div className="p-8 text-white/40">Loading...</div>

  const tabs = [
    { id: 'branding', label: 'Firm Profile' },
    { id: 'email', label: 'Email Settings' },
    { id: 'notifications', label: 'Notifications' },
  ]

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-white font-bold text-xl mb-8">Firm Settings</h1>

      <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1">
        {tabs.map(tab => (
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

      {activeTab === 'branding' && (
        <div className="bg-white/2 border border-white/10 rounded-xl p-6 space-y-4">
          <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">Firm Profile</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-white/40 text-xs block mb-1.5">Firm Name</label>
              <input
                value={settings.name || ''}
                onChange={e => setSettings(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={e => setSettings(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Phone</label>
              <input
                type="tel"
                value={settings.phone || ''}
                onChange={e => setSettings(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Website</label>
              <input
                type="url"
                value={settings.website || ''}
                onChange={e => setSettings(p => ({ ...p, website: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Brand Colour</label>
              <div className="flex gap-2">
                <input
                  value={settings.primary_color || '#c9a84c'}
                  onChange={e => setSettings(p => ({ ...p, primary_color: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 font-mono"
                />
                <input
                  type="color"
                  value={settings.primary_color || '#c9a84c'}
                  onChange={e => setSettings(p => ({ ...p, primary_color: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-white/40 text-xs block mb-1.5">Logo URL</label>
              <input
                value={settings.logo_url || ''}
                onChange={e => setSettings(p => ({ ...p, logo_url: e.target.value }))}
                placeholder="https://yourfirm.co.uk/logo.png"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {!!settings.logo_url && <img src={settings.logo_url} alt="Logo preview" className="h-10 mt-2 rounded border border-white/10" />}
            </div>
            <div className="md:col-span-2">
              <label className="text-white/40 text-xs block mb-1.5">Address</label>
              <textarea
                value={settings.address || ''}
                onChange={e => setSettings(p => ({ ...p, address: e.target.value }))}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none"
              />
            </div>
          </div>
          <button
            onClick={saveBranding}
            disabled={saving}
            className="bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-4">
          <div className="bg-white/2 border border-white/10 rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Email Sender</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/40 text-xs block mb-1.5">From Name</label>
                <input
                  value={emailSettings.from_name || ''}
                  onChange={e => setEmailSettings(p => ({ ...p, from_name: e.target.value }))}
                  placeholder="Smith & Associates"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-1.5">Reply-To Email</label>
                <input
                  type="email"
                  value={emailSettings.reply_to || ''}
                  onChange={e => setEmailSettings(p => ({ ...p, reply_to: e.target.value }))}
                  placeholder="hello@yourfirm.co.uk"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>
            </div>
            <button
              onClick={saveEmailSettings}
              disabled={saving}
              className="mt-4 bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Email Settings'}
            </button>
          </div>
          <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">Custom Domain</p>
            <p className="text-white/50 text-sm mb-4">Send emails from your own domain (e.g. hello@yourfirm.co.uk).</p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-[#c9a84c] text-[#0a1628] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <p className="text-white text-sm">Create a free Resend account at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-[#c9a84c] hover:underline">resend.com</a></p>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-[#c9a84c] text-[#0a1628] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <p className="text-white text-sm">Add your domain and verify DNS records</p>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 bg-[#c9a84c] text-[#0a1628] rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <p className="text-white text-sm">Contact us at <a href="mailto:hello@lexflow.co.uk" className="text-[#c9a84c] hover:underline">hello@lexflow.co.uk</a> and we will connect it for you</p>
              </li>
            </ol>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && firmId && (
        <NotificationSettings firmId={firmId} />
      )}
    </div>
  )
}

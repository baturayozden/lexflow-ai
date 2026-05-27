'use client'
import { useState } from 'react'

const VISA_TYPES = [
  'Student Visa', 'Skilled Worker Visa', 'Family Visa',
  'Visitor Visa', 'No Current Visa', 'Other',
]
const CASE_TYPES = [
  'ILR / Settled Status', 'Spouse / Partner Visa', 'Student Visa Extension',
  'Skilled Worker Visa', 'British Citizenship', 'Family Reunion',
  'Visit Visa', 'Other',
]
const NATIONALITIES = [
  'Afghan','Albanian','Algerian','American','Argentine','Armenian','Australian',
  'Austrian','Azerbaijani','Bahraini','Bangladeshi','Belgian','Brazilian','British',
  'Bulgarian','Canadian','Chilean','Chinese','Colombian','Croatian','Czech','Danish',
  'Dutch','Egyptian','Emirati','Estonian','Ethiopian','Filipino','Finnish','French',
  'Georgian','German','Ghanaian','Greek','Hungarian','Indian','Indonesian','Iranian',
  'Iraqi','Irish','Israeli','Italian','Japanese','Jordanian','Kazakhstani','Kenyan',
  'Korean','Kuwaiti','Latvian','Lebanese','Lithuanian','Malaysian','Mexican',
  'Moroccan','Nepalese','New Zealander','Nigerian','Norwegian','Pakistani',
  'Palestinian','Peruvian','Polish','Portuguese','Qatari','Romanian','Russian',
  'Saudi','Serbian','Singaporean','Slovak','Slovenian','Somali','South African',
  'Spanish','Sri Lankan','Swedish','Swiss','Syrian','Taiwanese','Thai','Tunisian',
  'Turkish','Turkmen','Ugandan','Ukrainian','Uzbek','Venezuelan','Vietnamese',
]

interface Props {
  firmId: string
  firmName: string
  primaryColor: string
}

export function PublicIntakeForm({ firmId, firmName, primaryColor }: Props) {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form')
  const [natSearch, setNatSearch] = useState('')
  const [showNatList, setShowNatList] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    dob: '', nationality: '', visaType: 'Skilled Worker Visa',
    visaExpiry: '', caseType: 'ILR / Settled Status', description: '',
  })

  const filteredNats = NATIONALITIES
    .filter(n => n.toLowerCase().includes(natSearch.toLowerCase()))
    .slice(0, 6)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.nationality || !form.description) {
      setError('Please fill in all required fields.')
      return
    }
    setStep('loading')
    setError('')

    try {
      // Generate AI summary
      const demoRes = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const demoData = await demoRes.json()
      if (!demoRes.ok) throw new Error(demoData.error || 'Failed to process your request.')

      // Save case linked to firm
      const saveRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          summary: demoData.summary,
          ip: demoData.ip,
          city: demoData.city,
          country: demoData.country,
          caseId: Date.now().toString(),
          firm_id: firmId,
        }),
      })
      const saveData = await saveRes.json()
      const ref = saveData.case?.reference_id || Date.now().toString()

      // Notify firm's managing partner
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_case',
          data: {
            client_name: form.name,
            client_email: form.email,
            case_type: form.caseType,
            nationality: form.nationality,
            city: demoData.city || 'Unknown',
            country: demoData.country || 'Unknown',
            reference_id: ref,
            firm_id: firmId,
          },
        }),
      })

      setReferenceId(ref)
      setStep('success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      if (msg.includes('Too many') || msg.includes('429')) {
        setError('You have submitted too many forms recently. Please wait an hour and try again, or contact the firm directly.')
      } else {
        setError(msg)
      }
      setStep('form')
    }
  }

  const btnStyle = { backgroundColor: primaryColor, color: '#0a1628' }
  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white text-sm focus:outline-none transition-colors placeholder-white/20'

  if (step === 'loading') {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4 animate-pulse" style={{ color: primaryColor }}>⚡</div>
        <p className="text-white font-semibold text-lg">Processing your request</p>
        <p className="text-white/40 text-sm mt-2">Our AI is preparing your case summary…</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="bg-white/2 border border-white/10 rounded-2xl p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: primaryColor + '20', border: `2px solid ${primaryColor}40` }}
        >
          <span className="text-2xl" style={{ color: primaryColor }}>✓</span>
        </div>
        <h2 className="text-white font-bold text-xl mb-3">Request Received!</h2>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          Thank you for contacting <strong className="text-white">{firmName}</strong>.
          We have received your details and will be in touch within one business day.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-white/40 text-xs mb-1">Your reference number</p>
          <p className="text-white font-mono font-bold text-lg">{referenceId}</p>
          <p className="text-white/30 text-xs mt-1">Please keep this for your records</p>
        </div>
        <p className="text-white/30 text-xs">A confirmation will be sent to your email address.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/2 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Full Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
            placeholder="Jane Smith"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Date of Birth *</label>
          <input
            type="date"
            value={form.dob}
            onChange={e => setForm(p => ({ ...p, dob: e.target.value }))}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Email Address *</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            required
            placeholder="jane@email.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            placeholder="+44 7700 900000"
            className={inputCls}
          />
        </div>
      </div>

      {/* Nationality search */}
      <div className="relative">
        <label className="text-white/40 text-xs block mb-1.5">Nationality *</label>
        <input
          value={natSearch || form.nationality}
          onChange={e => {
            setNatSearch(e.target.value)
            setShowNatList(true)
            if (!e.target.value) setForm(p => ({ ...p, nationality: '' }))
          }}
          onFocus={() => setShowNatList(true)}
          onBlur={() => setTimeout(() => setShowNatList(false), 200)}
          placeholder="Type your nationality…"
          className={inputCls}
        />
        {showNatList && natSearch && filteredNats.length > 0 && (
          <div className="absolute z-10 w-full bg-[#0d1f3c] border border-white/20 rounded-lg mt-1 overflow-hidden shadow-xl">
            {filteredNats.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setForm(p => ({ ...p, nationality: n }))
                  setNatSearch('')
                  setShowNatList(false)
                }}
                className="w-full text-left px-4 py-2.5 text-white text-sm hover:bg-white/10 transition-colors"
              >
                {n}
              </button>
            ))}
          </div>
        )}
        {form.nationality && !natSearch && (
          <div className="mt-1">
            <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/60">
              {form.nationality}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Current Immigration Status *</label>
          <select
            value={form.visaType}
            onChange={e => setForm(p => ({ ...p, visaType: e.target.value }))}
            className={inputCls}
          >
            {VISA_TYPES.map(v => (
              <option key={v} value={v} className="bg-[#0a1628]">{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Visa Expiry Date</label>
          <input
            type="date"
            value={form.visaExpiry}
            onChange={e => setForm(p => ({ ...p, visaExpiry: e.target.value }))}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="text-white/40 text-xs block mb-1.5">Service Required *</label>
        <select
          value={form.caseType}
          onChange={e => setForm(p => ({ ...p, caseType: e.target.value }))}
          className={inputCls}
        >
          {CASE_TYPES.map(c => (
            <option key={c} value={c} className="bg-[#0a1628]">{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-white/40 text-xs block mb-1.5">Please describe your situation *</label>
        <textarea
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          required
          rows={4}
          placeholder="Please tell us about your current situation and what help you need. You can write in any language."
          className={`${inputCls} resize-none`}
        />
        <p className="text-white/20 text-xs mt-1">You can write in any language.</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        style={btnStyle}
        className="w-full font-bold py-4 rounded-xl text-sm hover:opacity-90 transition-opacity"
      >
        Submit Request →
      </button>

      <p className="text-white/20 text-xs text-center">
        🔒 Your information is encrypted and secure. By submitting, you agree to be contacted by {firmName}.
      </p>
    </form>
  )
}

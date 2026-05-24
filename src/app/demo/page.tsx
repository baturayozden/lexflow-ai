'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const VISA_TYPES = ['Student Visa', 'Work Visa', 'Family Visa', 'Visit Visa', 'No Current Visa']
const CASE_TYPES = ['ILR Application', 'Spouse Visa', 'Student Visa Extension', 'Work Visa Extension', 'British Citizenship']
const NATIONALITIES = ['Afghan','Albanian','Algerian','American','Argentine','Armenian','Australian','Austrian','Azerbaijani','Bahraini','Bangladeshi','Belgian','Brazilian','British','Bulgarian','Canadian','Chilean','Chinese','Colombian','Croatian','Czech','Danish','Dutch','Egyptian','Emirati','Estonian','Ethiopian','Filipino','Finnish','French','Georgian','German','Ghanaian','Greek','Hungarian','Indian','Indonesian','Iranian','Iraqi','Irish','Israeli','Italian','Japanese','Jordanian','Kazakhstani','Kenyan','Korean','Kuwaiti','Latvian','Lebanese','Lithuanian','Malaysian','Mexican','Moroccan','Nepalese','New Zealander','Nigerian','Norwegian','Pakistani','Palestinian','Peruvian','Polish','Portuguese','Qatari','Romanian','Russian','Saudi','Serbian','Singaporean','Slovak','Slovenian','Somali','South African','Spanish','Sri Lankan','Swedish','Swiss','Syrian','Taiwanese','Thai','Tunisian','Turkish','Turkmen','Ugandan','Ukrainian','Uzbek','Venezuelan','Vietnamese']

export default function DemoPage() {
  const { data: session } = useSession()
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session?.user as any)?.firmId
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmName = (session?.user as any)?.firmName || 'Your Firm'

  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    dob: '', nationality: '', visaType: 'Work Visa',
    visaExpiry: '', caseType: 'ILR Application', description: '',
  })
  const [natSearch, setNatSearch] = useState('')
  const [showNatList, setShowNatList] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [caseId, setCaseId] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const filteredNats = NATIONALITIES.filter(n => n.toLowerCase().includes(natSearch.toLowerCase())).slice(0, 6)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.nationality) { setError('Please fill in all required fields'); return }
    setStep('loading')
    setError('')

    try {
      const startTime = Date.now()

      // Generate AI summary
      const demoRes = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const demoData = await demoRes.json()

      if (!demoRes.ok) throw new Error(demoData.error || 'Failed to generate summary')

      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(1)
      const refId = Date.now().toString()

      // Save case with firm_id
      const saveRes = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          summary: demoData.summary,
          ip: demoData.ip,
          city: demoData.city,
          country: demoData.country,
          caseId: refId,
          firm_id: firmId,
        }),
      })
      const saveData = await saveRes.json()

      setResult({ ...demoData, timeTaken })
      setCaseId(saveData.case?.id || '')
      setReferenceId(saveData.case?.reference_id || refId)
      setStep('result')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep('form')
    }
  }

  function renderMarkdown(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^## (.+)$/gm, '<h3 style="color:#c9a84c;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:24px 0 8px;">$1</h3>')
      .replace(/^- (.+)$/gm, '<li style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:4px;margin-left:16px;list-style:disc;">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:4px;margin-left:16px;list-style:decimal;">$2</li>')
      .replace(/^---$/gm, '<hr style="border-color:rgba(255,255,255,0.1);margin:16px 0;">')
      .replace(/\n\n/g, '<br/><br/>')
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#c9a84c] text-4xl mb-4 animate-pulse">⚡</div>
          <p className="text-white font-semibold text-lg">Generating AI Case Summary</p>
          <p className="text-white/40 text-sm mt-2">Analysing client details...</p>
        </div>
      </div>
    )
  }

  if (step === 'result' && result) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={() => { setStep('form'); setResult(null) }} className="text-white/40 hover:text-white text-sm transition-colors">← New Case</button>
              <span className="text-white/20">/</span>
              <span className="text-white/60 text-sm">{form.name}</span>
            </div>
            <button onClick={() => router.push('/dashboard/cases')} className="text-[#c9a84c] text-sm hover:underline">View All Cases →</button>
          </div>

          <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center">
                  <span className="text-[#c9a84c] text-sm">⚡</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">AI Case Summary</div>
                  <div className="text-[#c9a84c] text-xs">Ready for Solicitor Review</div>
                </div>
              </div>
              <span className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">● Complete</span>
            </div>
            <div
              className="text-white/80 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.summary) }}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <p className="text-white/30 text-xs italic">Generated in {result.timeTaken}s using LexFlow AI</p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                <span className="text-green-400 text-xs">✓ Saved · Ref: <strong>{referenceId}</strong></span>
              </div>
            </div>
          </div>

          {!!caseId && (
            <div className="bg-white/2 border border-white/10 rounded-xl p-6">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-4">⚡ Action Centre</p>
              <p className="text-white/40 text-sm">
                <a href={`/dashboard/cases/${caseId}`} className="text-[#c9a84c] hover:underline">Open in Case Dashboard →</a>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-2xl">AI Client Intake</h1>
          <p className="text-[#c9a84c] font-semibold">{firmName}</p>
          <p className="text-white/40 text-sm mt-1">Fill in the form to generate an AI case summary</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/2 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Client Full Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Jane Smith" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Date of Birth *</label>
              <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="jane@email.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9+\s()-]/g, '') }))} placeholder="+44 7700 900000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            </div>
          </div>

          <div className="relative">
            <label className="text-white/40 text-xs block mb-1.5">Nationality *</label>
            <input
              value={natSearch || form.nationality}
              onChange={e => { setNatSearch(e.target.value); setShowNatList(true); if (!e.target.value) setForm(p => ({ ...p, nationality: '' })) }}
              onFocus={() => setShowNatList(true)}
              onBlur={() => setTimeout(() => setShowNatList(false), 200)}
              placeholder="Start typing nationality..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
            />
            {showNatList && natSearch && filteredNats.length > 0 && (
              <div className="absolute z-10 w-full bg-[#0d1f3c] border border-[#c9a84c]/30 rounded-lg mt-1 overflow-hidden">
                {filteredNats.map(n => (
                  <button key={n} type="button" onClick={() => { setForm(p => ({ ...p, nationality: n })); setNatSearch(''); setShowNatList(false) }} className="w-full text-left px-4 py-2.5 text-white text-sm hover:bg-[#c9a84c]/10 transition-colors">
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Current Visa Type *</label>
              <select value={form.visaType} onChange={e => setForm(p => ({ ...p, visaType: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50">
                {VISA_TYPES.map(v => <option key={v} value={v} className="bg-[#0a1628]">{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Visa Expiry Date</label>
              <input type="date" value={form.visaExpiry} onChange={e => setForm(p => ({ ...p, visaExpiry: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs block mb-1.5">Case Type *</label>
            <select value={form.caseType} onChange={e => setForm(p => ({ ...p, caseType: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50">
              {CASE_TYPES.map(c => <option key={c} value={c} className="bg-[#0a1628]">{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-white/40 text-xs block mb-1.5">Brief Description *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={3} placeholder="Describe the client&apos;s situation..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-[#c9a84c] text-[#0a1628] font-bold py-4 rounded-xl text-sm hover:bg-[#f0d080] transition-colors">
            ⚡ Generate AI Summary →
          </button>

          <p className="text-white/20 text-xs text-center">🔒 Data is securely saved. AI summaries are for initial assessment only.</p>
        </form>
      </div>
    </div>
  )
}

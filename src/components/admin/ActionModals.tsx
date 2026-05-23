'use client'
import { useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  clientName: string
  clientEmail: string
  caseType: string
  referenceId: string
  caseId: string
  aiSummary?: string
  nationality?: string
  visaType?: string
  description?: string
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1f3c] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Checklist Modal ────────────────────────────────────────────────────────────

export function ChecklistModal({ isOpen, onClose, clientName, clientEmail, caseType, referenceId }: ModalProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendChecklist() {
    setSending(true)
    try {
      await fetch('/api/actions/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientEmail, caseType, referenceId }),
      })
      setSent(true)
      setTimeout(() => { setSent(false); onClose() }, 2000)
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Document Checklist">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-1">Sending to</p>
          <p className="text-white text-sm font-medium">{clientName}</p>
          <p className="text-white/60 text-sm">{clientEmail}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-1">Document list for</p>
          <p className="text-[#c9a84c] text-sm font-medium">{caseType}</p>
          <p className="text-white/40 text-xs mt-1">
            The checklist will be pulled from your templates in Settings.
          </p>
        </div>
        <p className="text-white/40 text-xs">Reference: {referenceId}</p>
        {sent ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center text-green-400 text-sm">
            ✓ Checklist sent successfully
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendChecklist}
              disabled={sending}
              className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send Checklist →'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── Quote Modal ────────────────────────────────────────────────────────────────

interface QuoteResult {
  minFee: number
  maxFee: number
  currency: string
  homeOfficeFee?: number
  notes?: string
}

export function QuoteModal({ isOpen, onClose, clientName, clientEmail, caseType, referenceId }: ModalProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [quote, setQuote] = useState<QuoteResult | null>(null)

  async function sendQuote() {
    setSending(true)
    try {
      const res = await fetch('/api/actions/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientEmail, caseType, referenceId }),
      })
      const data = await res.json()
      setQuote(data.quote)
      setSent(true)
      setTimeout(() => { setSent(false); onClose() }, 3000)
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate & Send Quote">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-1">Sending to</p>
          <p className="text-white text-sm font-medium">{clientName}</p>
          <p className="text-white/60 text-sm">{clientEmail}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-2">Fee estimate for {caseType}</p>
          <p className="text-white/40 text-xs">
            Quote will be pulled from your templates in Settings → Quotes.
          </p>
        </div>
        {sent && quote ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center text-green-400 text-sm">
            ✓ Quote sent — £{quote.minFee?.toLocaleString()} – £{quote.maxFee?.toLocaleString()}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendQuote}
              disabled={sending}
              className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {sending ? 'Generating…' : 'Send Quote →'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── Eligibility Modal ──────────────────────────────────────────────────────────

interface EligibilityResult {
  eligible: boolean | string
  confidence: string
  summary: string
  key_requirements_met: string[]
  key_concerns: string[]
  recommendation: string
}

export function EligibilityModal({
  isOpen,
  onClose,
  caseType,
  nationality,
  visaType,
  description,
  aiSummary,
}: ModalProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EligibilityResult | null>(null)

  async function runCheck() {
    setLoading(true)
    try {
      const res = await fetch('/api/actions/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseType, nationality, visaType, description, aiSummary }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const eligibilityColor =
    result?.eligible === true
      ? 'text-green-400'
      : result?.eligible === false
        ? 'text-red-400'
        : 'text-yellow-400'
  const eligibilityBg =
    result?.eligible === true
      ? 'bg-green-500/10 border-green-500/20'
      : result?.eligible === false
        ? 'bg-red-500/10 border-red-500/20'
        : 'bg-yellow-500/10 border-yellow-500/20'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Eligibility Check">
      <div className="space-y-4">
        {!result && !loading && (
          <>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-3">
                Run an AI-powered eligibility assessment based on the client details and AI summary.
              </p>
              <div className="space-y-1">
                <p className="text-white/40 text-xs">
                  Case type: <span className="text-white/70">{caseType}</span>
                </p>
                <p className="text-white/40 text-xs">
                  Nationality: <span className="text-white/70">{nationality}</span>
                </p>
                <p className="text-white/40 text-xs">
                  Current visa: <span className="text-white/70">{visaType}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={runCheck}
                className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors"
              >
                Run Check →
              </button>
            </div>
          </>
        )}
        {loading && (
          <div className="text-center py-8">
            <div className="text-[#c9a84c] text-3xl mb-3">⚡</div>
            <p className="text-white/60 text-sm">Running eligibility assessment…</p>
          </div>
        )}
        {result && (
          <div className="space-y-3">
            <div className={`border rounded-xl p-4 ${eligibilityBg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold text-lg ${eligibilityColor}`}>
                  {result.eligible === true
                    ? '✓ Likely Eligible'
                    : result.eligible === false
                      ? '✗ Concerns Identified'
                      : String(result.eligible)}
                </span>
                <span className="text-white/40 text-xs bg-white/5 px-2 py-1 rounded-full">
                  {result.confidence} confidence
                </span>
              </div>
              <p className="text-white/80 text-sm">{result.summary}</p>
            </div>
            {result.key_requirements_met?.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <p className="text-green-400 text-xs font-semibold mb-2">Requirements Met</p>
                {result.key_requirements_met.map((r, i) => (
                  <p key={i} className="text-white/60 text-xs mb-1">✓ {r}</p>
                ))}
              </div>
            )}
            {result.key_concerns?.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                <p className="text-red-400 text-xs font-semibold mb-2">Key Concerns</p>
                {result.key_concerns.map((c, i) => (
                  <p key={i} className="text-white/60 text-xs mb-1">⚠ {c}</p>
                ))}
              </div>
            )}
            {result.recommendation && (
              <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-3">
                <p className="text-[#c9a84c] text-xs font-semibold mb-1">Recommendation</p>
                <p className="text-white/70 text-sm">{result.recommendation}</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// ── Follow-up Modal ────────────────────────────────────────────────────────────

export function FollowUpModal({ isOpen, onClose, clientName, clientEmail, caseType, referenceId }: ModalProps) {
  const [message, setMessage] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendFollowUp() {
    setSending(true)
    try {
      await fetch('/api/actions/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, clientEmail, caseType, referenceId, message, scheduledDate }),
      })
      setSent(true)
      setTimeout(() => { setSent(false); onClose() }, 2000)
    } catch {
      // silent
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Follow-up">
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-white/40 text-xs mb-1">Sending to</p>
          <p className="text-white text-sm font-medium">{clientName}</p>
          <p className="text-white/60 text-sm">{clientEmail}</p>
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Message to client (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="We wanted to update you on your case…"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1.5">Next appointment date (optional)</label>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
          />
        </div>
        {sent ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center text-green-400 text-sm">
            ✓ Follow-up sent successfully
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-white/10 text-white/60 py-2.5 rounded-lg text-sm hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendFollowUp}
              disabled={sending}
              className="flex-1 bg-[#c9a84c] text-[#0a1628] font-bold py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send Follow-up →'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

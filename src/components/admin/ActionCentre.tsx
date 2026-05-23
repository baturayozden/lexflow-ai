'use client'
import { useState, useEffect } from 'react'

interface CaseAction {
  id: string
  case_id: string
  step: string
  type: string
  urgency: string
  completed: boolean
  completed_at: string | null
  completed_by: string | null
  sort_order: number
}

const ACTION_LABELS: Record<string, string> = {
  consultation: 'Book Consultation',
  documents: 'Send Checklist',
  eligibility: 'Run Eligibility Check',
  quote: 'Generate Quote',
  followup: 'Schedule Follow-up',
}

const URGENCY_COLORS: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

interface Props {
  caseId: string
  clientName: string
  clientEmail: string
  aiSummary: string
}

export function ActionCentre({ caseId, clientName, clientEmail, aiSummary }: Props) {
  const [actions, setActions] = useState<CaseAction[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetch(`/api/case-actions?caseId=${caseId}`)
      .then((r) => r.json())
      .then((data) => {
        setActions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [caseId])

  async function toggleAction(action: CaseAction) {
    const newCompleted = !action.completed
    setActions((prev) =>
      prev.map((a) => (a.id === action.id ? { ...a, completed: newCompleted } : a))
    )
    await fetch(`/api/case-actions/${action.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted, completedBy: 'Admin' }),
    })
  }

  async function generateActions() {
    setGenerating(true)
    try {
      const parseRes = await fetch('/api/parse-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: aiSummary }),
      })
      const parsed = await parseRes.json()
      const steps: { step: string; type: string; urgency: string }[] = Array.isArray(parsed)
        ? parsed
        : parsed.steps || []

      const saveRes = await fetch('/api/case-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, steps }),
      })
      const saved = await saveRes.json()
      setActions(Array.isArray(saved) ? saved : [])
    } catch (e) {
      console.error('Failed to generate actions:', e)
    } finally {
      setGenerating(false)
    }
  }

  const completed = actions.filter((a) => a.completed).length
  const total = actions.length

  if (loading) {
    return (
      <div className="bg-white/2 border border-white/10 rounded-xl p-5">
        <p className="text-white/30 text-sm">Loading actions…</p>
      </div>
    )
  }

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#c9a84c]">⚡</span>
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">Action Centre</h3>
        </div>
        {total > 0 && (
          <span className="text-white/40 text-xs">{completed} of {total} completed</span>
        )}
      </div>

      {total === 0 ? (
        <div className="text-center py-6">
          <p className="text-white/30 text-sm mb-4">No action steps yet.</p>
          <button
            onClick={generateActions}
            disabled={generating}
            className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm px-4 py-2 rounded-lg hover:bg-[#c9a84c]/20 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating…' : '⚡ Generate AI Action Steps'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                action.completed
                  ? 'bg-white/2 border-white/5 opacity-60'
                  : 'bg-white/3 border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleAction(action)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    action.completed
                      ? 'bg-[#c9a84c] border-[#c9a84c]'
                      : 'border-[#c9a84c]/40 hover:border-[#c9a84c]'
                  }`}
                >
                  {action.completed && (
                    <span className="text-[#0a1628] text-xs font-bold">✓</span>
                  )}
                </button>
                <div className="min-w-0">
                  <p
                    className={`text-sm truncate ${
                      action.completed ? 'line-through text-white/30' : 'text-white/80'
                    }`}
                  >
                    {action.step}
                  </p>
                  <span
                    className={`text-xs font-medium uppercase ${
                      URGENCY_COLORS[action.urgency] || 'text-white/40'
                    }`}
                  >
                    {action.urgency} priority
                  </span>
                </div>
              </div>
              <a
                href={`mailto:${clientEmail}?subject=${encodeURIComponent(
                  `Re: ${action.step}`
                )}&body=${encodeURIComponent(
                  `Dear ${clientName},\n\nFollowing up on your case.\n\nBest regards`
                )}`}
                className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs px-3 py-1.5 rounded-lg hover:bg-[#c9a84c]/20 transition-colors ml-3 whitespace-nowrap flex-shrink-0"
              >
                {ACTION_LABELS[action.type] || 'Take Action'}
              </a>
            </div>
          ))}
          <button
            onClick={generateActions}
            disabled={generating}
            className="w-full mt-2 text-white/20 text-xs hover:text-white/40 transition-colors py-1"
          >
            {generating ? 'Regenerating…' : '↻ Regenerate action steps'}
          </button>
        </div>
      )}
    </div>
  )
}

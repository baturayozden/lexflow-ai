'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ChecklistStep {
  key: string
  label: string
  description: string
  auto?: boolean
}

const STEPS: ChecklistStep[] = [
  { key: 'firm_created',      label: 'Firm Created',         description: 'Firm account has been set up in LexFlow',           auto: true },
  { key: 'user_created',      label: 'User Created',         description: 'At least one team member has been added',            auto: true },
  { key: 'brand_configured',  label: 'Brand Configured',     description: 'Firm name, logo, and brand colour are set',          auto: false },
  { key: 'intake_shared',     label: 'Intake URL Shared',    description: 'Client intake page link has been sent to the firm',  auto: false },
  { key: 'widget_installed',  label: 'Widget Installed',     description: 'Embed widget code added to the firm\'s website',     auto: false },
  { key: 'first_case',        label: 'First Case Received',  description: 'At least one case has been submitted',               auto: true },
  { key: 'payment_received',  label: 'Payment Received',     description: 'First payment has been recorded as paid',            auto: true },
  { key: 'live',              label: 'Marked as Live',       description: 'All setup complete — firm is fully live on LexFlow', auto: false },
]

interface OnboardingChecklistProps {
  firmId: string
  steps: Record<string, boolean>
  autoDetect: {
    hasUsers: boolean
    hasCases: boolean
    hasPayments: boolean
  }
}

export function OnboardingChecklist({ firmId, steps: initialSteps, autoDetect }: OnboardingChecklistProps) {
  const router = useRouter()
  const [steps, setSteps] = useState<Record<string, boolean>>(() => {
    const s = { ...initialSteps }
    // Auto-fill detected states
    s.firm_created = true
    if (autoDetect.hasUsers) s.user_created = true
    if (autoDetect.hasCases) s.first_case = true
    if (autoDetect.hasPayments) s.payment_received = true
    return s
  })
  const [saving, setSaving] = useState(false)

  const completed = STEPS.filter(s => steps[s.key]).length
  const pct = Math.round((completed / STEPS.length) * 100)

  async function toggle(key: string, isAuto: boolean) {
    if (isAuto) return // auto steps are read-only
    const next = { ...steps, [key]: !steps[key] }
    setSteps(next)
    setSaving(true)
    try {
      const allDone = STEPS.every(s => next[s.key])
      await fetch(`/api/firms/${firmId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_steps: next, onboarding_completed: allDone }),
      })
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">Onboarding Checklist</h3>
          <p className="text-white/40 text-xs mt-0.5">{completed}/{STEPS.length} steps complete</p>
        </div>
        {saving && <span className="text-white/30 text-xs">Saving…</span>}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#c9a84c] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {STEPS.map(step => {
          const done = !!steps[step.key]
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => toggle(step.key, !!step.auto)}
              disabled={!!step.auto}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                step.auto ? 'cursor-default' : 'hover:bg-white/3'
              }`}
            >
              <span className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
                done
                  ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0a1628]'
                  : 'border-white/20 bg-white/3'
              }`}>
                {done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${done ? 'text-white/60 line-through' : 'text-white'}`}>
                  {step.label}
                  {step.auto && <span className="ml-1.5 text-[10px] text-white/30 no-underline not-italic font-normal">(auto)</span>}
                </div>
                <div className="text-white/30 text-xs truncate">{step.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

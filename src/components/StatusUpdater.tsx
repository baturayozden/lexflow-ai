'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CASE_STATUSES = ['new', 'reviewed', 'archived']
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed']

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  reviewed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  archived: 'bg-white/5 text-white/30 border-white/10',
  contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  qualified: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-white/5 text-white/30 border-white/10',
}

export function StatusUpdater({
  id,
  currentStatus,
  type,
}: {
  id: string
  currentStatus: string
  type: 'cases' | 'leads'
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const statuses = type === 'cases' ? CASE_STATUSES : LEAD_STATUSES

  async function updateStatus(newStatus: string) {
    setLoading(true)
    await fetch(`/api/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-white/40 text-xs">Status:</span>
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => updateStatus(s)}
          disabled={loading || s === status}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            s === status
              ? statusColors[s] + ' font-semibold'
              : 'bg-white/2 text-white/30 border-white/10 hover:border-white/30 hover:text-white/60'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

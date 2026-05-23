'use client'
import { useState, useEffect } from 'react'

interface Review {
  id: string
  case_type: string
  status: string
  gov_url: string
  changes_summary: string
  current_items: string[]
  proposed_items: string[]
  created_at: string
  reviewed_at: string | null
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        setReviews(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function approve(id: string) {
    setProcessing(id)
    await fetch(`/api/reviews/${id}/approve`, { method: 'POST' })
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
    setProcessing(null)
  }

  async function reject(id: string) {
    setProcessing(id)
    await fetch(`/api/reviews/${id}/reject`, { method: 'POST' })
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)))
    setProcessing(null)
  }

  async function runManualCheck() {
    setLoading(true)
    try {
      const res = await fetch('/api/cron/checklist-review', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'manual'}` },
      })
      const data = await res.json()
      const updated = await fetch('/api/reviews').then((r) => r.json())
      setReviews(updated || [])
      alert(`Check complete. ${data.changedCount || 0} change(s) detected.`)
    } catch {
      alert('Check failed — see console for details.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter)
  const pendingCount = reviews.filter((r) => r.status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <p className="text-white/40">Loading reviews…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-bold text-xl">Checklist Reviews</h1>
            <p className="text-white/40 text-sm mt-1">
              Gov.uk compliance updates requiring your approval
            </p>
          </div>
          <button
            onClick={runManualCheck}
            className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-sm px-4 py-2.5 rounded-lg hover:bg-[#c9a84c]/20 transition-colors"
          >
            ↻ Run Manual Check
          </button>
        </div>

        {pendingCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-yellow-400 text-xl">⚠</span>
            <p className="text-yellow-400 text-sm font-medium">
              {pendingCount} checklist update{pendingCount > 1 ? 's' : ''} pending your review
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-[#c9a84c] text-[#0a1628] font-semibold'
                  : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {f} {f === 'pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/30 text-sm">No {filter} reviews.</p>
            {filter === 'pending' && (
              <p className="text-white/20 text-xs mt-2">
                Run a manual check or wait for the monthly automated check.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((review) => (
              <div
                key={review.id}
                className={`bg-white/2 border rounded-xl p-6 ${
                  review.status === 'pending'
                    ? 'border-yellow-500/20'
                    : review.status === 'approved'
                      ? 'border-green-500/20'
                      : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{review.case_type}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border capitalize ${
                          review.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : review.status === 'approved'
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-white/5 text-white/30 border-white/10'
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>
                    <a
                      href={review.gov_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#c9a84c] text-xs hover:underline mt-1 block"
                    >
                      {review.gov_url} ↗
                    </a>
                    <p className="text-white/40 text-xs mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {review.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => reject(review.id)}
                        disabled={processing === review.id}
                        className="border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approve(review.id)}
                        disabled={processing === review.id}
                        className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        {processing === review.id ? 'Applying…' : '✓ Approve & Apply'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-3 mb-4">
                  <p className="text-[#c9a84c] text-xs font-semibold mb-1">Changes Summary</p>
                  <p className="text-white/70 text-sm">{review.changes_summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
                      Current
                    </p>
                    <ul className="space-y-1">
                      {(review.current_items || []).map((item, i) => (
                        <li key={i} className="text-white/50 text-xs flex gap-2">
                          <span className="text-white/20 flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      Proposed
                    </p>
                    <ul className="space-y-1">
                      {(review.proposed_items || []).map((item, i) => {
                        const isNew = !(review.current_items || []).includes(item)
                        return (
                          <li
                            key={i}
                            className={`text-xs flex gap-2 ${isNew ? 'text-green-400' : 'text-white/50'}`}
                          >
                            <span className="flex-shrink-0">{isNew ? '+' : '•'}</span>
                            {item}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

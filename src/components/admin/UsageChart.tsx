'use client'

interface Case {
  created_at: string
}

interface UsageChartProps {
  cases: Case[]
  casesThisMonth: number
}

export function UsageChart({ cases, casesThisMonth }: UsageChartProps) {
  // Build last 8 weeks buckets
  const now = new Date()
  const weeks: { label: string; start: Date; end: Date }[] = []
  for (let i = 7; i >= 0; i--) {
    const end = new Date(now)
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 7)
    weeks.push({
      label: end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      start,
      end,
    })
  }

  const buckets = weeks.map(w => {
    const count = cases.filter(c => {
      const d = new Date(c.created_at)
      return d >= w.start && d < w.end
    }).length
    return { ...w, count }
  })

  const max = Math.max(...buckets.map(b => b.count), 1)

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Case Intake (8 weeks)</h3>
          <p className="text-white/40 text-xs mt-0.5">New cases submitted</p>
        </div>
        <div className="text-right">
          <div className="text-[#c9a84c] font-bold text-xl">{casesThisMonth}</div>
          <div className="text-white/40 text-xs">this month</div>
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-24">
        {buckets.map((b, i) => {
          const height = max > 0 ? Math.round((b.count / max) * 100) : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-sm bg-blue-500/40 hover:bg-blue-400/60 transition-colors relative group"
                  style={{ height: `${Math.max(height, b.count > 0 ? 4 : 0)}%` }}
                >
                  {b.count > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {b.count}
                    </div>
                  )}
                </div>
              </div>
              {i % 2 === 0 && (
                <div className="text-white/20 text-[9px] truncate w-full text-center">{b.label}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

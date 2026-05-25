'use client'

interface Payment {
  amount: number
  status: string
  paid_at?: string | null
  created_at: string
}

interface RevenueChartProps {
  payments: Payment[]
}

export function RevenueChart({ payments }: RevenueChartProps) {
  // Build last 6 months buckets
  const now = new Date()
  const months: { label: string; year: number; month: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      label: d.toLocaleDateString('en-GB', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    })
  }

  const buckets = months.map(m => {
    const total = payments
      .filter(p => {
        if (p.status !== 'paid') return false
        const date = new Date(p.paid_at || p.created_at)
        return date.getFullYear() === m.year && date.getMonth() === m.month
      })
      .reduce((sum, p) => sum + p.amount, 0)
    return { ...m, total }
  })

  const max = Math.max(...buckets.map(b => b.total), 1)
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Revenue (6 months)</h3>
          <p className="text-white/40 text-xs mt-0.5">Paid payments only</p>
        </div>
        <div className="text-right">
          <div className="text-[#c9a84c] font-bold text-xl">£{totalPaid.toLocaleString()}</div>
          <div className="text-white/40 text-xs">total received</div>
        </div>
      </div>

      <div className="flex items-end gap-2 h-24">
        {buckets.map(b => {
          const height = max > 0 ? Math.round((b.total / max) * 100) : 0
          return (
            <div key={`${b.year}-${b.month}`} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-sm bg-[#c9a84c]/60 hover:bg-[#c9a84c] transition-colors relative group"
                  style={{ height: `${Math.max(height, b.total > 0 ? 4 : 0)}%` }}
                >
                  {b.total > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      £{b.total.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-white/30 text-[10px]">{b.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface Payment {
  id: string
  amount: number
  status: string
  payment_type?: string | null
  description?: string | null
  paid_at?: string | null
  due_at?: string | null
  created_at: string
}

interface PaymentTimelineProps {
  payments: Payment[]
}

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  paid: { dot: 'bg-green-400', label: 'Paid' },
  pending: { dot: 'bg-yellow-400', label: 'Pending' },
  overdue: { dot: 'bg-red-400', label: 'Overdue' },
}

export function PaymentTimeline({ payments }: PaymentTimelineProps) {
  if (!payments.length) return null

  const sorted = [...payments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold text-sm mb-4">Payment Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />

        <div className="space-y-4">
          {sorted.map(p => {
            const style = STATUS_STYLES[p.status] || { dot: 'bg-white/20', label: p.status }
            const date = new Date(p.paid_at || p.due_at || p.created_at)
            return (
              <div key={p.id} className="flex items-start gap-4 pl-7 relative">
                {/* Dot */}
                <span className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-[#0d1f3c] ${style.dot}`} />
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">£{p.amount.toLocaleString()}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        p.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                        p.status === 'overdue' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {style.label}
                      </span>
                      {p.payment_type && (
                        <span className="text-white/30 text-xs">{p.payment_type.replace('_', ' ')}</span>
                      )}
                    </div>
                    <span className="text-white/30 text-xs shrink-0">
                      {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-white/40 text-xs mt-0.5 truncate">{p.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

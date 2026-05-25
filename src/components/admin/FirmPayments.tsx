'use client'
import { useState } from 'react'

interface Payment {
  id: string
  amount: number
  currency: string
  payment_type: string
  status: string
  description?: string
  paid_at?: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  paid: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
}

interface Props {
  firmId: string
  initialPayments: Payment[]
  firmPlan: string
}

export function FirmPayments({ firmId, initialPayments, firmPlan }: Props) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    payment_type: firmPlan === 'retainer' ? 'monthly' : 'one_time',
    status: 'paid',
    description: '',
    paid_at: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  async function addPayment() {
    if (!form.amount) return
    setLoading(true)
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, firm_id: firmId, amount: parseInt(form.amount) }),
    })
    const payment = await res.json()
    setPayments(prev => [payment, ...prev])
    setForm({
      amount: '',
      payment_type: 'one_time',
      status: 'paid',
      description: '',
      paid_at: new Date().toISOString().split('T')[0],
    })
    setShowAdd(false)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/payments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Payments</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs px-3 py-2 rounded-lg hover:bg-[#c9a84c]/20 transition-colors"
        >
          + Record Payment
        </button>
      </div>

      {showAdd && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-white/40 text-xs block mb-1">Amount (£)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                placeholder="997"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Type</label>
              <select value={form.payment_type} onChange={e => setForm(p => ({ ...p, payment_type: e.target.value }))} className={inputCls}>
                <option value="one_time" className="bg-[#0a1628]">One-time</option>
                <option value="monthly" className="bg-[#0a1628]">Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
                <option value="paid" className="bg-[#0a1628]">Paid</option>
                <option value="pending" className="bg-[#0a1628]">Pending</option>
                <option value="overdue" className="bg-[#0a1628]">Overdue</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Date</label>
              <input
                type="date"
                value={form.paid_at}
                onChange={e => setForm(p => ({ ...p, paid_at: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="text-white/40 text-xs block mb-1">Description</label>
              <input
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Quick Win setup fee"
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="border border-white/10 text-white/50 text-sm px-4 py-2 rounded-lg hover:border-white/30 transition-colors">
              Cancel
            </button>
            <button
              onClick={addPayment}
              disabled={loading || !form.amount}
              className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <p className="text-white/30 text-sm">No payments recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white/2 border border-white/5 rounded-lg p-3">
              <div>
                <div className="text-white font-semibold">£{p.amount.toLocaleString()}</div>
                <div className="text-white/40 text-xs">
                  {p.description || p.payment_type.replace('_', '-')}
                  {p.paid_at && ` · ${new Date(p.paid_at).toLocaleDateString('en-GB')}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[p.status] || 'bg-white/5 text-white/30 border-white/10'}`}>
                  {p.status}
                </span>
                {p.status !== 'paid' && (
                  <button
                    onClick={() => updateStatus(p.id, 'paid')}
                    className="text-green-400/60 text-xs hover:text-green-400 transition-colors"
                  >
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

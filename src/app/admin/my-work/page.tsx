'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CaseAction {
  id: string
  urgency: string
  completed: boolean
}

interface AssignedCase {
  id: string
  client_name: string
  case_type: string
  nationality: string
  status: string
  team_members: { name: string } | null
  case_actions?: CaseAction[]
}

interface AssignedLead {
  id: string
  name: string
  firm_name: string
  firm_type: string
  status: string
  team_members: { name: string } | null
}

export default function MyWorkPage() {
  const [cases, setCases] = useState<AssignedCase[]>([])
  const [leads, setLeads] = useState<AssignedLead[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/cases').then((r) => {
        if (r.status === 401) { router.push('/admin/login'); throw new Error('Unauthorized') }
        return r.json()
      }),
      fetch('/api/admin/leads').then((r) => {
        if (r.status === 401) { router.push('/admin/login'); throw new Error('Unauthorized') }
        return r.json()
      }),
    ])
      .then(([casesData, leadsData]) => {
        setCases(casesData.cases || [])
        setLeads(leadsData.leads || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-white/40 text-sm">Loading…</p>
      </div>
    )
  }

  const assignedCases = cases.filter((c) => c.team_members)
  const assignedLeads = leads.filter((l) => l.team_members)
  const highPriorityCases = assignedCases.filter((c) =>
    c.case_actions?.some((a) => a.urgency === 'high' && !a.completed)
  )

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    contacted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    qualified: 'bg-green-500/10 text-green-400 border-green-500/20',
    processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    closed: 'bg-white/5 text-white/30 border-white/10',
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-white font-bold text-xl">Assigned Work</h1>
          <p className="text-white/40 text-sm mt-1">All leads and cases currently assigned to team members.</p>
        </div>

        {/* High priority alert */}
        {highPriorityCases.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
              ⚠ High Priority — Action Required
            </p>
            <div className="space-y-2">
              {highPriorityCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/cases/${c.id}`}
                  className="flex items-center justify-between bg-white/2 rounded-lg p-3 hover:bg-white/4 transition-colors"
                >
                  <div>
                    <span className="text-white text-sm font-medium">{c.client_name}</span>
                    <span className="text-white/40 text-sm ml-2">— {c.case_type}</span>
                    {c.team_members && (
                      <span className="text-[#c9a84c]/60 text-xs ml-2">→ {c.team_members.name}</span>
                    )}
                  </div>
                  <span className="text-red-400 text-xs">View →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Cases */}
          <div>
            <h2 className="text-white font-semibold mb-3">
              Assigned Cases{' '}
              <span className="text-white/30 font-normal text-sm">({assignedCases.length})</span>
            </h2>
            <div className="space-y-2">
              {assignedCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/cases/${c.id}`}
                  className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium text-sm">{c.client_name}</div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {c.case_type} · {c.nationality}
                      </div>
                      {c.team_members && (
                        <div className="text-[#c9a84c]/60 text-xs mt-1">→ {c.team_members.name}</div>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        statusColors[c.status] || 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </Link>
              ))}
              {!assignedCases.length && (
                <p className="text-white/30 text-sm py-4 text-center">No cases assigned yet.</p>
              )}
            </div>
          </div>

          {/* Assigned Leads */}
          <div>
            <h2 className="text-white font-semibold mb-3">
              Assigned Leads{' '}
              <span className="text-white/30 font-normal text-sm">({assignedLeads.length})</span>
            </h2>
            <div className="space-y-2">
              {assignedLeads.map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/leads/${l.id}`}
                  className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium text-sm">{l.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {l.firm_name} · {l.firm_type}
                      </div>
                      {l.team_members && (
                        <div className="text-[#c9a84c]/60 text-xs mt-1">→ {l.team_members.name}</div>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        statusColors[l.status] || 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                </Link>
              ))}
              {!assignedLeads.length && (
                <p className="text-white/30 text-sm py-4 text-center">No leads assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ROLE_LABELS: Record<string, string> = {
  managing_partner: 'Managing Partner',
  senior_solicitor: 'Senior Solicitor',
  associate_solicitor: 'Associate Solicitor',
  paralegal: 'Paralegal',
  receptionist: 'Receptionist',
}

interface TeamMember {
  id: string
  name: string
  role: string
}

// ── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string
  name: string
  firm_name: string
  email: string
  phone?: string
  firm_type: string
  status: string
  message?: string
  created_at: string
  assigned_to?: string | null
  team_members?: { name: string; email: string; role: string } | null
}

interface Case {
  id: string
  client_name: string
  client_email: string
  case_type: string
  nationality: string
  city: string
  country: string
  status: string
  reference_id: string
  created_at: string
  assigned_to?: string | null
  team_members?: { name: string; email: string; role: string } | null
}

// ── CSV helpers ──────────────────────────────────────────────────────────────
function escapeCsv(val: unknown): string {
  const s = val == null ? '' : String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return
  const keys = Object.keys(rows[0])
  const lines = [keys.join(','), ...rows.map((r) => keys.map((k) => escapeCsv(r[k])).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Status badge ─────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300',
  contacted: 'bg-yellow-500/15 text-yellow-300',
  qualified: 'bg-green-500/15 text-green-300',
  closed: 'bg-white/10 text-white/40',
  rejected: 'bg-red-500/15 text-red-400',
  processing: 'bg-purple-500/15 text-purple-300',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status] || 'bg-white/10 text-white/50'}`}>
      {status}
    </span>
  )
}

// ── Inline delete confirm ─────────────────────────────────────────────────────
function DeleteInline({
  id,
  type,
  onDeleted,
}: {
  id: string
  type: 'leads' | 'cases'
  onDeleted: (id: string) => void
}) {
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeleting(true)
    await fetch(`/api/${type}/${id}`, { method: 'DELETE' })
    onDeleted(id)
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-1.5" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
        <span className="text-white/50 text-xs">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 text-xs underline disabled:opacity-50"
        >
          {deleting ? '…' : 'Yes'}
        </button>
        <span className="text-white/30 text-xs">/</span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirm(false) }}
          className="text-white/40 text-xs underline"
        >
          No
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirm(true) }}
      className="text-red-400/50 text-xs hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Filters
  const [leadSearch, setLeadSearch] = useState('')
  const [leadFirmType, setLeadFirmType] = useState('')
  const [leadStatus, setLeadStatus] = useState('')
  const [caseSearch, setCaseSearch] = useState('')
  const [caseCaseType, setCaseCaseType] = useState('')
  const [caseStatus, setCaseStatus] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [leadsRes, casesRes] = await Promise.all([
          fetch('/api/admin/leads'),
          fetch('/api/admin/cases'),
        ])
        if (leadsRes.status === 401 || casesRes.status === 401) {
          router.push('/admin/login')
          return
        }
        const teamRes = fetch('/api/team')
        const [leadsData, casesData, teamResponse] = await Promise.all([
          leadsRes.json(),
          casesRes.json(),
          teamRes,
        ])
        setLeads(leadsData.leads || [])
        setCases(casesData.cases || [])
        const teamData = await teamResponse.json()
        setTeamMembers(teamData.members || [])
      } catch (e) {
        console.error('Admin load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return {
      totalLeads: leads.length,
      newThisWeek: leads.filter((l) => new Date(l.created_at) > weekAgo).length,
      demoCases: cases.length,
      qualified: leads.filter((l) => l.status === 'qualified').length,
    }
  }, [leads, cases])

  // ── Distinct filter options ────────────────────────────────────────────────
  const firmTypes = useMemo(() => [...new Set(leads.map((l) => l.firm_type).filter(Boolean))].sort(), [leads])
  const leadStatuses = useMemo(() => [...new Set(leads.map((l) => l.status).filter(Boolean))].sort(), [leads])
  const caseTypes = useMemo(() => [...new Set(cases.map((c) => c.case_type).filter(Boolean))].sort(), [cases])
  const caseStatuses = useMemo(() => [...new Set(cases.map((c) => c.status).filter(Boolean))].sort(), [cases])

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    const q = leadSearch.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.firm_name?.toLowerCase().includes(q)
      const matchFirmType = !leadFirmType || l.firm_type === leadFirmType
      const matchStatus = !leadStatus || l.status === leadStatus
      return matchSearch && matchFirmType && matchStatus
    })
  }, [leads, leadSearch, leadFirmType, leadStatus])

  const filteredCases = useMemo(() => {
    const q = caseSearch.toLowerCase()
    return cases.filter((c) => {
      const matchSearch =
        !q ||
        c.client_name?.toLowerCase().includes(q) ||
        c.client_email?.toLowerCase().includes(q) ||
        c.case_type?.toLowerCase().includes(q)
      const matchCaseType = !caseCaseType || c.case_type === caseCaseType
      const matchStatus = !caseStatus || c.status === caseStatus
      return matchSearch && matchCaseType && matchStatus
    })
  }, [cases, caseSearch, caseCaseType, caseStatus])

  // ── Delete handlers ────────────────────────────────────────────────────────
  function handleLeadDeleted(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }
  function handleCaseDeleted(id: string) {
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  // ── CSV export ─────────────────────────────────────────────────────────────
  function exportLeads() {
    exportToCSV(
      filteredLeads.map((l) => ({
        name: l.name,
        firm_name: l.firm_name,
        email: l.email,
        phone: l.phone || '',
        firm_type: l.firm_type,
        status: l.status,
        assigned_to: l.team_members?.name || '',
        message: l.message || '',
        created_at: l.created_at,
      })),
      `lexflow-leads-${new Date().toISOString().slice(0, 10)}.csv`
    )
  }

  function exportCases() {
    exportToCSV(
      filteredCases.map((c) => ({
        client_name: c.client_name,
        client_email: c.client_email,
        case_type: c.case_type,
        nationality: c.nationality,
        city: c.city,
        country: c.country,
        status: c.status,
        reference_id: c.reference_id,
        assigned_to: c.team_members?.name || '',
        created_at: c.created_at,
      })),
      `lexflow-cases-${new Date().toISOString().slice(0, 10)}.csv`
    )
  }

  // ── Team workload ──────────────────────────────────────────────────────────
  const workload = useMemo(() => {
    return teamMembers.map((m) => ({
      ...m,
      caseCount: cases.filter((c) => c.assigned_to === m.id).length,
      leadCount: leads.filter((l) => l.assigned_to === m.id).length,
    }))
  }, [teamMembers, cases, leads])

  // ── Shared input/select styles ─────────────────────────────────────────────
  const inputClass =
    'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'
  const selectClass =
    'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: stats.totalLeads },
            { label: 'New This Week', value: stats.newThisWeek },
            { label: 'Demo Cases', value: stats.demoCases },
            { label: 'Qualified', value: stats.qualified },
          ].map((s) => (
            <div key={s.label} className="bg-white/3 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-[#c9a84c] font-bold text-3xl">{loading ? '—' : s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-white/40 text-sm text-center py-20">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── LEADS ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">
                  Leads <span className="text-white/30 text-sm font-normal ml-1">({filteredLeads.length})</span>
                </h2>
                <button
                  onClick={exportLeads}
                  className="text-[#c9a84c] text-xs border border-[#c9a84c]/30 px-3 py-1.5 rounded-lg hover:border-[#c9a84c]/60 transition-colors"
                >
                  ↓ CSV
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Search…"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <select value={leadFirmType} onChange={(e) => setLeadFirmType(e.target.value)} className={selectClass}>
                  <option value="">All types</option>
                  {firmTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)} className={selectClass}>
                  <option value="">All status</option>
                  {leadStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    key={lead.id}
                    className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-white font-medium">{lead.name}</div>
                        <div className="text-white/40 text-sm">{lead.firm_name}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={lead.status} />
                        <span className="text-[#c9a84c]/70 text-xs">{lead.firm_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-white/30 text-xs">
                        {new Date(lead.created_at).toLocaleDateString('en-GB')}
                        {lead.team_members && (
                          <span className="ml-2 text-[#c9a84c]/60">→ {lead.team_members.name}</span>
                        )}
                      </div>
                      <DeleteInline id={lead.id} type="leads" onDeleted={handleLeadDeleted} />
                    </div>
                  </Link>
                ))}
                {!filteredLeads.length && (
                  <p className="text-white/30 text-sm py-4 text-center">No leads match your filters.</p>
                )}
              </div>
            </div>

            {/* ── CASES ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">
                  Demo Cases <span className="text-white/30 text-sm font-normal ml-1">({filteredCases.length})</span>
                </h2>
                <button
                  onClick={exportCases}
                  className="text-[#c9a84c] text-xs border border-[#c9a84c]/30 px-3 py-1.5 rounded-lg hover:border-[#c9a84c]/60 transition-colors"
                >
                  ↓ CSV
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Search…"
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <select value={caseCaseType} onChange={(e) => setCaseCaseType(e.target.value)} className={selectClass}>
                  <option value="">All types</option>
                  {caseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={caseStatus} onChange={(e) => setCaseStatus(e.target.value)} className={selectClass}>
                  <option value="">All status</option>
                  {caseStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {filteredCases.map((c) => (
                  <Link
                    href={`/admin/cases/${c.id}`}
                    key={c.id}
                    className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="text-white font-medium">{c.client_name}</div>
                        <div className="text-white/40 text-sm">{c.case_type}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StatusBadge status={c.status} />
                        <span className="text-[#c9a84c]/70 text-xs">{c.nationality}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-white/30 text-xs">
                        {new Date(c.created_at).toLocaleDateString('en-GB')} · {c.city}
                        {c.team_members && (
                          <span className="ml-2 text-[#c9a84c]/60">→ {c.team_members.name}</span>
                        )}
                      </div>
                      <DeleteInline id={c.id} type="cases" onDeleted={handleCaseDeleted} />
                    </div>
                  </Link>
                ))}
                {!filteredCases.length && (
                  <p className="text-white/30 text-sm py-4 text-center">No cases match your filters.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── TEAM WORKLOAD ── */}
        {!loading && workload.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white font-semibold mb-4">Team Workload</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {workload.map((member) => (
                <Link
                  key={member.id}
                  href="/admin/my-work"
                  className="bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors"
                >
                  <div className="text-white font-medium text-sm truncate">{member.name}</div>
                  <div className="text-white/30 text-xs mt-0.5">{ROLE_LABELS[member.role] || member.role}</div>
                  <div className="mt-3 flex items-end gap-3">
                    <div>
                      <span className="text-[#c9a84c] text-2xl font-bold">{member.caseCount}</span>
                      <span className="text-white/30 text-xs ml-1">cases</span>
                    </div>
                    <div>
                      <span className="text-white/60 text-lg font-semibold">{member.leadCount}</span>
                      <span className="text-white/30 text-xs ml-1">leads</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

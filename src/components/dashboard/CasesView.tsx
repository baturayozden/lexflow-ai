'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Case {
  id: string
  client_name: string
  case_type: string
  nationality: string
  status: string
  created_at: string
  reference_id: string
  team_members?: { name: string } | null
  case_actions?: { id: string; completed: boolean }[]
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  reviewed: 'Reviewed',
  in_progress: 'In Progress',
  awaiting_docs: 'Awaiting Docs',
  submitted: 'Submitted',
  completed: 'Completed',
  closed: 'Closed',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  reviewed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  awaiting_docs: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  submitted: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  closed: 'bg-white/5 text-white/30 border-white/10',
}

const PIPELINE_STAGES = ['new', 'reviewed', 'in_progress', 'awaiting_docs', 'submitted', 'completed']

export function CasesView({ cases }: { cases: Case[] }) {
  const [view, setView] = useState<'list' | 'pipeline'>('list')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')

  const caseTypes = useMemo(() => {
    const types = [...new Set(cases.map(c => c.case_type).filter(Boolean))]
    return types.sort()
  }, [cases])

  const filtered = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch =
        !search ||
        c.client_name.toLowerCase().includes(search.toLowerCase()) ||
        c.case_type.toLowerCase().includes(search.toLowerCase()) ||
        c.reference_id?.toLowerCase().includes(search.toLowerCase()) ||
        c.nationality?.toLowerCase().includes(search.toLowerCase())
      const matchesType = !filterType || c.case_type === filterType
      return matchesSearch && matchesType
    })
  }, [cases, search, filterType])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Cases</h1>
          <p className="text-white/40 text-sm mt-0.5">{cases.length} total</p>
        </div>
        <Link
          href="/dashboard/intake"
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
        >
          New Intake
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, case type, reference…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c9a84c]/50"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
        >
          <option value="">All case types</option>
          {caseTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 text-sm transition-colors ${view === 'list' ? 'bg-[#c9a84c] text-[#0a1628] font-semibold' : 'text-white/40 hover:text-white'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('pipeline')}
            className={`px-3 py-2 text-sm transition-colors ${view === 'pipeline' ? 'bg-[#c9a84c] text-[#0a1628] font-semibold' : 'text-white/40 hover:text-white'}`}
          >
            Pipeline
          </button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-2">
          {filtered.map(c => {
            const totalActions = c.case_actions?.length || 0
            const completedActions = c.case_actions?.filter(a => a.completed).length || 0
            return (
              <Link
                key={c.id}
                href={`/dashboard/cases/${c.id}`}
                className="block bg-white/2 border border-white/10 rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-white font-medium">{c.client_name}</div>
                    <div className="text-white/40 text-sm mt-0.5">{c.case_type} · {c.nationality}</div>
                    <div className="text-white/25 text-xs mt-1">Ref: {c.reference_id}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    {totalActions > 0 && (
                      <div className="text-right hidden sm:block">
                        <div className="text-white/40 text-xs">Actions</div>
                        <div className={`text-sm font-medium ${completedActions === totalActions ? 'text-green-400' : 'text-[#c9a84c]'}`}>
                          {completedActions}/{totalActions}
                        </div>
                      </div>
                    )}
                    {!!c.team_members && (
                      <div className="text-right hidden sm:block">
                        <div className="text-white/40 text-xs">Assigned</div>
                        <div className="text-white/60 text-sm">{c.team_members.name}</div>
                      </div>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[c.status] || 'bg-white/5 text-white/30 border-white/10'}`}>
                      {STATUS_LABELS[c.status] || c.status}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
          {!filtered.length && (
            <div className="bg-white/2 border border-white/10 rounded-xl p-12 text-center">
              <p className="text-white/30 text-sm">{search || filterType ? 'No cases match your filters.' : 'No cases yet.'}</p>
            </div>
          )}
        </div>
      )}

      {/* Pipeline view */}
      {view === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {PIPELINE_STAGES.map(stage => {
              const stageCases = filtered.filter(c => c.status === stage)
              return (
                <div key={stage} className="w-64 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[stage]}`}>
                      {STATUS_LABELS[stage]}
                    </span>
                    <span className="text-white/30 text-xs">{stageCases.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageCases.map(c => (
                      <Link
                        key={c.id}
                        href={`/dashboard/cases/${c.id}`}
                        className="block bg-white/2 border border-white/10 rounded-xl p-3 hover:border-[#c9a84c]/30 transition-colors"
                      >
                        <div className="text-white text-sm font-medium leading-snug">{c.client_name}</div>
                        <div className="text-white/40 text-xs mt-1">{c.case_type}</div>
                        {!!c.team_members && (
                          <div className="text-white/25 text-xs mt-1.5">{c.team_members.name}</div>
                        )}
                        <div className="text-white/20 text-xs mt-1">
                          {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </Link>
                    ))}
                    {!stageCases.length && (
                      <div className="border border-dashed border-white/5 rounded-xl p-4 text-center">
                        <p className="text-white/15 text-xs">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

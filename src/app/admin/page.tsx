'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'

export default function AdminPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [leadSearch, setLeadSearch] = useState('')
  const [caseSearch, setCaseSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
        const [leadsData, casesData] = await Promise.all([leadsRes.json(), casesRes.json()])
        setLeads(leadsData.leads || [])
        setCases(casesData.cases || [])
      } catch (e) {
        console.error('Admin load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const filteredLeads = leads.filter((l) => {
    const q = leadSearch.toLowerCase()
    return (
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.firm_name?.toLowerCase().includes(q)
    )
  })

  const filteredCases = cases.filter((c) => {
    const q = caseSearch.toLowerCase()
    return (
      c.client_name?.toLowerCase().includes(q) ||
      c.client_email?.toLowerCase().includes(q) ||
      c.case_type?.toLowerCase().includes(q)
    )
  })

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 mb-3'

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#c9a84c] font-bold text-2xl">Lex</span>
            <span className="text-white font-bold text-2xl">Flow</span>
            <span className="text-white/40 text-sm ml-3">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-sm">
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
                <div className="text-[#c9a84c] font-bold text-xl">{leads.length}</div>
                <div className="text-white/40">Leads</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
                <div className="text-[#c9a84c] font-bold text-xl">{cases.length}</div>
                <div className="text-white/40">Demo Cases</div>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>

        {loading ? (
          <div className="text-white/40 text-sm text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-white font-semibold mb-3">Recent Leads</h2>
              <input
                type="text"
                placeholder="Search leads..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className={inputClass}
              />
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    key={lead.id}
                    className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">{lead.name}</div>
                        <div className="text-white/40 text-sm">{lead.firm_name}</div>
                        <div className="text-white/40 text-sm">{lead.email}</div>
                      </div>
                      <div className="text-right">
                        <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs px-2 py-1 rounded-full">{lead.firm_type}</span>
                        <div className="text-white/30 text-xs mt-1">{new Date(lead.created_at).toLocaleDateString('en-GB')}</div>
                      </div>
                    </div>
                    {lead.message && (
                      <p className="text-white/50 text-sm mt-2 border-t border-white/5 pt-2 line-clamp-1">{lead.message}</p>
                    )}
                  </Link>
                ))}
                {!filteredLeads.length && (
                  <p className="text-white/30 text-sm">{leadSearch ? 'No leads match your search.' : 'No leads yet.'}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-white font-semibold mb-3">Demo Cases</h2>
              <input
                type="text"
                placeholder="Search cases..."
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
                className={inputClass}
              />
              <div className="space-y-3">
                {filteredCases.map((c) => (
                  <Link
                    href={`/admin/cases/${c.id}`}
                    key={c.id}
                    className="block bg-white/2 border border-white/10 rounded-xl p-4 hover:border-[#c9a84c]/30 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">{c.client_name}</div>
                        <div className="text-white/40 text-sm">{c.case_type}</div>
                        <div className="text-white/40 text-sm">{c.client_email}</div>
                      </div>
                      <div className="text-right">
                        <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-xs px-2 py-1 rounded-full">{c.nationality}</span>
                        <div className="text-white/30 text-xs mt-1">{new Date(c.created_at).toLocaleDateString('en-GB')}</div>
                      </div>
                    </div>
                    <div className="text-white/30 text-xs mt-2">Ref: {c.reference_id} • {c.city}, {c.country}</div>
                  </Link>
                ))}
                {!filteredCases.length && (
                  <p className="text-white/30 text-sm">{caseSearch ? 'No cases match your search.' : 'No demo cases yet.'}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getLeads, getCases } from '@/lib/db'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const [leads, cases] = await Promise.all([getLeads(), getCases()])

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#c9a84c] font-bold text-2xl">Lex</span>
            <span className="text-white font-bold text-2xl">Flow</span>
            <span className="text-white/40 text-sm ml-3">Admin Panel</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
              <div className="text-[#c9a84c] font-bold text-xl">{leads?.length || 0}</div>
              <div className="text-white/40">Leads</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
              <div className="text-[#c9a84c] font-bold text-xl">{cases?.length || 0}</div>
              <div className="text-white/40">Demo Cases</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-white font-semibold mb-4">Recent Leads</h2>
            <div className="space-y-3">
              {leads?.map((lead: any) => (
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
                  {lead.message && <p className="text-white/50 text-sm mt-2 border-t border-white/5 pt-2 line-clamp-1">{lead.message}</p>}
                </Link>
              ))}
              {!leads?.length && <p className="text-white/30 text-sm">No leads yet.</p>}
            </div>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-4">Demo Cases</h2>
            <div className="space-y-3">
              {cases?.map((c: any) => (
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
              {!cases?.length && <p className="text-white/30 text-sm">No demo cases yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

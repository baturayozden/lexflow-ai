import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

async function getLead(id: string) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/admin/login')

  const lead = await getLead(id)

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">← Back to Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Lead — {lead.name}</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            <p className="text-white/40 mt-1">{lead.firm_name} • {lead.firm_type}</p>
          </div>
          <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-sm px-3 py-1 rounded-full border border-[#c9a84c]/20">{lead.status}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Contact Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Full Name</div><div className="text-white text-sm">{lead.name}</div></div>
              <div><div className="text-white/40 text-xs">Email</div><div className="text-white text-sm">{lead.email}</div></div>
              <div><div className="text-white/40 text-xs">Phone</div><div className="text-white text-sm">{lead.phone || '—'}</div></div>
            </div>
          </div>

          {/* Firm Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Firm Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Firm Name</div><div className="text-white text-sm">{lead.firm_name}</div></div>
              <div><div className="text-white/40 text-xs">Practice Area</div><div className="text-white text-sm">{lead.firm_type}</div></div>
              <div><div className="text-white/40 text-xs">Source</div><div className="text-white text-sm">{lead.source}</div></div>
              <div>
                <div className="text-white/40 text-xs">Submitted</div>
                <div className="text-white text-sm">
                  {new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' '}at{' '}
                  {new Date(lead.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {lead.message && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">Their Message</h3>
            <p className="text-white/80 text-sm leading-relaxed">{lead.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${lead.email}?subject=Re: Your LexFlow Enquiry&body=Dear ${lead.name},%0D%0A%0D%0AThank you for getting in touch with LexFlow. We would love to arrange a free 20-minute audit for ${lead.firm_name}.%0D%0A%0D%0AWhen would be a good time to speak?`}
              className="bg-[#c9a84c] text-[#0a1628] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
            >
              ✉ Email Lead
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="border border-white/20 text-white text-sm px-4 py-2 rounded-lg hover:border-white/40 transition-colors"
              >
                📞 Call Lead
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

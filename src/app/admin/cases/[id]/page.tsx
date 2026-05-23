import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

async function getCase(id: string) {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) redirect('/admin/login')

  const c = await getCase(id)

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">← Back to Admin</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Case {c.reference_id}</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{c.client_name}</h1>
            <p className="text-white/40 mt-1">{c.case_type} • {c.nationality} • {c.city}, {c.country}</p>
          </div>
          <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-sm px-3 py-1 rounded-full border border-[#c9a84c]/20">{c.status}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Client Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Client Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Email</div><div className="text-white text-sm">{c.client_email}</div></div>
              <div><div className="text-white/40 text-xs">Phone</div><div className="text-white text-sm">{c.client_phone || '—'}</div></div>
              <div><div className="text-white/40 text-xs">Nationality</div><div className="text-white text-sm">{c.nationality}</div></div>
              <div><div className="text-white/40 text-xs">Location</div><div className="text-white text-sm">{c.city}, {c.country}</div></div>
            </div>
          </div>

          {/* Case Info */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Case Details</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Case Type</div><div className="text-white text-sm">{c.case_type}</div></div>
              <div><div className="text-white/40 text-xs">Current Visa</div><div className="text-white text-sm">{c.visa_type}</div></div>
              <div><div className="text-white/40 text-xs">Visa Expiry</div><div className="text-white text-sm">{c.visa_expiry || 'Not provided'}</div></div>
              <div><div className="text-white/40 text-xs">Reference</div><div className="text-white text-sm font-mono text-xs">{c.reference_id}</div></div>
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white/2 border border-white/10 rounded-xl p-5">
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Submission</h3>
            <div className="space-y-3">
              <div><div className="text-white/40 text-xs">Date</div><div className="text-white text-sm">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
              <div><div className="text-white/40 text-xs">Time</div><div className="text-white text-sm">{new Date(c.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div></div>
              <div><div className="text-white/40 text-xs">IP Address</div><div className="text-white text-sm font-mono text-xs">{c.ip || '—'}</div></div>
              <div><div className="text-white/40 text-xs">Status</div><div className="text-white text-sm">{c.status}</div></div>
            </div>
          </div>
        </div>

        {/* Client Description */}
        <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-3">Client&apos;s Description</h3>
          <p className="text-white/80 text-sm leading-relaxed">{c.description}</p>
        </div>

        {/* AI Summary */}
        <div className="bg-white/2 border border-[#c9a84c]/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#c9a84c]">⚡</span>
            <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider">AI Case Summary</h3>
          </div>
          <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{c.ai_summary}</div>
        </div>

        {/* Actions */}
        <div className="bg-white/2 border border-white/10 rounded-xl p-5">
          <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${c.client_email}?subject=Re: Your ${c.case_type} Enquiry&body=Dear ${c.client_name},%0D%0A%0D%0AThank you for your enquiry regarding your ${c.case_type}.%0D%0A%0D%0AReference: ${c.reference_id}`}
              className="bg-[#c9a84c] text-[#0a1628] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors"
            >
              ✉ Email Client
            </a>
            <a
              href={`tel:${c.client_phone}`}
              className="border border-white/20 text-white text-sm px-4 py-2 rounded-lg hover:border-white/40 transition-colors"
            >
              📞 Call Client
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

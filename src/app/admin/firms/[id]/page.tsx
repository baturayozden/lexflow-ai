import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getFirmById, getUsersByFirm, getPaymentsByFirm, getFirmNotes, getFirmStats } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { FirmUsersTable } from '@/components/admin/FirmUsersTable'
import { FirmPayments } from '@/components/admin/FirmPayments'
import { FirmNotes } from '@/components/admin/FirmNotes'
import { FirmActions } from '@/components/admin/FirmActions'
import { FirmEditor } from '@/components/admin/FirmEditor'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { PaymentTimeline } from '@/components/admin/PaymentTimeline'
import { UsageChart } from '@/components/admin/UsageChart'
import { OnboardingChecklist } from '@/components/admin/OnboardingChecklist'

const PLAN_LABELS: Record<string, string> = {
  quick_win: 'Quick Win — £997',
  full_setup: 'Full Setup — £2,500',
  retainer: 'Retainer — £1,500/mo',
  starter: 'Starter',
  platform: 'Platform',
}

export default async function FirmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/admin/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isPlatformAdmin((session.user as any).role)) redirect('/admin')

  const { id } = await params
  const [firm, users, payments, notes, stats] = await Promise.all([
    getFirmById(id),
    getUsersByFirm(id),
    getPaymentsByFirm(id).catch(() => []),
    getFirmNotes(id).catch(() => []),
    getFirmStats(id).catch(() => ({
      totalCases: 0, casesThisMonth: 0, totalActions: 0,
      completedActions: 0, activeUsers: 0, aiCallsEstimate: 0,
    })),
  ])

  if (!firm) redirect('/admin/firms')

  // Fetch cases for usage chart
  const casesResult = await supabaseAdmin
    .from('cases')
    .select('created_at')
    .eq('firm_id', id)
    .is('deleted_at', null)
  const firmCases = casesResult.data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const f = firm as any

  const totalRevenue = payments.filter((p: { status: string }) => p.status === 'paid').reduce((sum: number, p: { amount: number }) => sum + p.amount, 0)
  const pendingRevenue = payments.filter((p: { status: string }) => p.status === 'pending' || p.status === 'overdue').reduce((sum: number, p: { amount: number }) => sum + p.amount, 0)

  const onboardingSteps: Record<string, boolean> = (f.onboarding_steps as Record<string, boolean>) || {}
  const autoDetect = {
    hasUsers: (users?.length || 0) > 0,
    hasCases: stats.totalCases > 0,
    hasPayments: payments.some((p: { status: string }) => p.status === 'paid'),
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/firms" className="text-white/40 hover:text-white text-sm transition-colors">← Firms</Link>
        <h1 className="text-white font-bold text-xl">{f.name}</h1>
        <span className={`text-xs px-2 py-1 rounded-full border ${
          f.plan === 'retainer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
          f.plan === 'full_setup' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          f.plan === 'quick_win' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
          'bg-white/5 text-white/40 border-white/10'
        }`}>
          {PLAN_LABELS[f.plan] || f.plan}
        </span>
        {!f.active && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Inactive</span>
        )}
        <div className="ml-auto">
          <FirmEditor firm={{
            id: f.id,
            name: f.name,
            email: f.email,
            phone: f.phone,
            website: f.website,
            address: f.address,
            plan: f.plan,
            primary_color: f.primary_color,
            active: f.active,
          }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-4">
          <div className="text-[#c9a84c] font-bold text-2xl">£{totalRevenue.toLocaleString()}</div>
          <div className="text-white/40 text-xs mt-1">Total Revenue</div>
          {pendingRevenue > 0 && <div className="text-yellow-400 text-xs">£{pendingRevenue.toLocaleString()} pending</div>}
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <div className="text-[#c9a84c] font-bold text-2xl">{stats.totalCases}</div>
          <div className="text-white/40 text-xs mt-1">Total Cases</div>
          <div className="text-white/20 text-xs">{stats.casesThisMonth} this month</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <div className="text-[#c9a84c] font-bold text-2xl">{stats.aiCallsEstimate}</div>
          <div className="text-white/40 text-xs mt-1">AI Calls</div>
          <div className="text-white/20 text-xs">cases + actions</div>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <div className="text-[#c9a84c] font-bold text-2xl">{stats.activeUsers}</div>
          <div className="text-white/40 text-xs mt-1">Active Users</div>
          <div className="text-white/20 text-xs">of {users?.length || 0} total</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <UsageChart cases={firmCases || []} casesThisMonth={stats.casesThisMonth} />
        <RevenueChart payments={payments as { amount: number; status: string; paid_at?: string | null; created_at: string }[]} />
      </div>

      {/* Firm Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Email</p>
          <p className="text-white text-sm">{f.email || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Phone</p>
          <p className="text-white text-sm">{f.phone || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Added</p>
          <p className="text-white text-sm">
            {new Date(f.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {!!f.website && (
          <div className="bg-white/2 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Website</p>
            <a href={f.website} target="_blank" rel="noreferrer" className="text-[#c9a84c] text-sm hover:underline truncate block">{f.website}</a>
          </div>
        )}
        {!!f.address && (
          <div className="col-span-3 bg-white/2 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Address</p>
            <p className="text-white text-sm">{f.address}</p>
          </div>
        )}
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist firmId={id} steps={onboardingSteps} autoDetect={autoDetect} />

      {/* Public Intake URL */}
      <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-xl p-5 mb-4">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-1">Public Intake URL</p>
        <p className="text-white/40 text-xs mb-3">Share this URL with the firm. Their clients can submit intake forms directly.</p>
        <div className="flex items-center gap-3">
          <code className="text-[#c9a84c] text-sm bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg px-3 py-2 flex-1 truncate">
            app.lexflow.co.uk/intake/{f.slug || f.id}
          </code>
          <a
            href={`https://app.lexflow.co.uk/intake/${f.slug || f.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#c9a84c] text-sm border border-[#c9a84c]/30 px-3 py-2 rounded-lg hover:bg-[#c9a84c]/10 transition-colors whitespace-nowrap"
          >
            Open →
          </a>
        </div>
      </div>

      {/* Embed Widget Code */}
      <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-4">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-1">Embed Widget</p>
        <p className="text-white/40 text-xs mb-3">Add this to the firm&apos;s website to show a &quot;Book a Consultation&quot; button.</p>
        <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-green-400 mb-2 overflow-x-auto whitespace-nowrap">
          {`<script src="https://app.lexflow.co.uk/widget.js" data-slug="${f.slug || f.id}" data-color="${f.primary_color || '#c9a84c'}"></script>`}
        </div>
        <p className="text-white/20 text-xs">Options: data-text=&quot;Book Now&quot; data-position=&quot;bottom-left&quot;</p>
      </div>

      {/* AI Chatbot Widget Code */}
      <div className="bg-white/2 border border-white/10 rounded-xl p-5 mb-6">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-1">AI Chatbot Widget</p>
        <p className="text-white/40 text-xs mb-3">Add this to the firm&apos;s website to show an AI chat assistant.</p>
        <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-green-400 mb-2 overflow-x-auto whitespace-nowrap">
          {`<script src="https://app.lexflow.co.uk/chatbot.js" data-slug="${f.slug || f.id}" data-color="${f.primary_color || '#c9a84c'}" data-firm="${f.name}"></script>`}
        </div>
        <p className="text-white/20 text-xs">The chatbot answers immigration questions and collects client details automatically.</p>
      </div>

      {/* Payments */}
      <div className="mb-6">
        <FirmPayments firmId={id} initialPayments={payments} firmPlan={f.plan || 'starter'} />
      </div>

      {/* Payment Timeline */}
      {payments.length > 0 && (
        <div className="mb-6">
          <PaymentTimeline payments={payments as {
            id: string; amount: number; status: string; payment_type?: string | null;
            description?: string | null; paid_at?: string | null; due_at?: string | null; created_at: string
          }[]} />
        </div>
      )}

      {/* Users */}
      <div className="bg-white/2 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Users ({users?.length || 0})</h2>
          <FirmActions firmId={id} />
        </div>
        <FirmUsersTable initialUsers={(users || []) as {
          id: string
          name: string
          email: string
          role: string
          active: boolean
          last_login_at: string | null
        }[]} firmId={id} />
      </div>

      {/* Internal Notes */}
      <FirmNotes firmId={id} initialNotes={notes as { id: string; content: string; author: string; created_at: string }[]} />

    </div>
  )
}

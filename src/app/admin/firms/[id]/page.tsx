import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getFirmById, getUsersByFirm } from '@/lib/auth-db'
import { isPlatformAdmin } from '@/lib/permissions'
import Link from 'next/link'
import { FirmActions } from '@/components/admin/FirmActions'

const PLAN_LABELS: Record<string, string> = {
  quick_win: 'Quick Win — £997',
  full_setup: 'Full Setup — £2,500',
  retainer: 'Retainer — £1,500/mo',
  starter: 'Starter',
  platform: 'Platform',
}

const ROLE_LABELS: Record<string, string> = {
  managing_partner: 'Managing Partner',
  senior_solicitor: 'Senior Solicitor',
  associate_solicitor: 'Associate Solicitor',
  paralegal: 'Paralegal',
  receptionist: 'Receptionist',
}

export default async function FirmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) redirect('/admin')

  const { id } = await params
  const [firm, users] = await Promise.all([
    getFirmById(id),
    getUsersByFirm(id),
  ])

  if (!firm) redirect('/admin/firms')

  const f = firm as Record<string, unknown>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/firms" className="text-white/40 hover:text-white text-sm transition-colors">← Firms</Link>
        <h1 className="text-white font-bold text-xl">{f.name as string}</h1>
        <span className={`text-xs px-2 py-1 rounded-full border ${
          f.plan === 'retainer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
          f.plan === 'full_setup' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          f.plan === 'quick_win' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
          'bg-white/5 text-white/40 border-white/10'
        }`}>
          {PLAN_LABELS[f.plan as string] || f.plan as string}
        </span>
      </div>

      {/* Firm info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Email</p>
          <p className="text-white text-sm">{(f.email as string) || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Phone</p>
          <p className="text-white text-sm">{(f.phone as string) || '—'}</p>
        </div>
        <div className="bg-white/2 border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs mb-1">Added</p>
          <p className="text-white text-sm">
            {new Date(f.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {!!f.address && (
          <div className="col-span-3 bg-white/2 border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Address</p>
            <p className="text-white text-sm">{f.address as string}</p>
          </div>
        )}
      </div>

      {/* Users */}
      <div className="bg-white/2 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Users ({users?.length || 0})</h2>
          <FirmActions firmId={id} />
        </div>
        <div className="space-y-2">
          {users?.map((user: Record<string, unknown>) => (
            <div key={user.id as string} className="flex items-center justify-between bg-white/2 border border-white/5 rounded-lg p-3">
              <div>
                <div className="text-white text-sm font-medium">{user.name as string}</div>
                <div className="text-white/40 text-xs">{user.email as string}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 text-xs">{ROLE_LABELS[user.role as string] || user.role as string}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${user.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
                {!!user.last_login_at && (
                  <span className="text-white/20 text-xs">
                    Last login: {new Date(user.last_login_at as string).toLocaleDateString('en-GB')}
                  </span>
                )}
              </div>
            </div>
          ))}
          {!users?.length && <p className="text-white/30 text-sm">No users yet.</p>}
        </div>
      </div>
    </div>
  )
}

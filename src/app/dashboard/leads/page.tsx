import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { LeadsView } from '@/components/dashboard/LeadsView'

export default async function DashboardLeadsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any
  const firmId = user?.firmId
  if (!firmId) redirect('/login')

  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('firm_id', firmId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <LeadsView
      leads={leads || []}
      firmId={firmId}
      firmName={user?.firmName || 'Your Firm'}
    />
  )
}

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { CasesView } from '@/components/dashboard/CasesView'

export default async function DashboardCasesPage() {
  const session = await auth()
  if (!session) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firmId = (session.user as any)?.firmId
  if (!firmId) redirect('/login')

  const { data: cases } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name), case_actions(id, completed)')
    .eq('firm_id', firmId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return <CasesView cases={cases || []} />
}

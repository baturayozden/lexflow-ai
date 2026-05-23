import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTeamMembers } from '@/lib/db'
import { TeamManager } from '@/components/admin/TeamManager'

export default async function TeamPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const members = await getTeamMembers()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <a href="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
            ← Dashboard
          </a>
          <span className="text-white/20">/</span>
          <h1 className="text-white font-bold text-xl">Team Members</h1>
        </div>
        <TeamManager initialMembers={members || []} />
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getTeamMembers } from '@/lib/db'
import { AddMemberForm } from '@/components/admin/AddMemberForm'
import { DeleteMemberButton } from '@/components/admin/DeleteMemberButton'

const roleColors: Record<string, string> = {
  admin: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
  associate: 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20',
  paralegal: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
}

export default async function TeamPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')

  const members = await getTeamMembers()

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Team Members</h1>
          <p className="text-white/40 text-sm">Manage who can be assigned leads and cases.</p>
        </div>

        {/* Add member */}
        <div className="mb-8">
          <AddMemberForm />
        </div>

        {/* Members list */}
        <div className="bg-white/2 border border-white/10 rounded-xl overflow-hidden">
          {members.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">No team members yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-5 py-3">Name</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-5 py-3">Email</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-5 py-3">Role</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider px-5 py-3">Joined</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-white font-medium text-sm">{m.name}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-white/50 text-sm">{m.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${roleColors[m.role] || roleColors.associate}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-white/30 text-xs">
                        {new Date(m.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DeleteMemberButton memberId={m.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

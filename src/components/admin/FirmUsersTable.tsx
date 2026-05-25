'use client'
import { useState } from 'react'
import { FirmUserActions } from './FirmUserActions'

const ROLE_LABELS: Record<string, string> = {
  managing_partner: 'Managing Partner',
  senior_solicitor: 'Senior Solicitor',
  associate_solicitor: 'Associate Solicitor',
  paralegal: 'Paralegal',
  receptionist: 'Receptionist',
}

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  last_login_at: string | null
}

export function FirmUsersTable({ initialUsers, firmId: _firmId }: { initialUsers: User[]; firmId?: string }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  function handleUpdate(id: string, changes: Partial<User>) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...changes } : u))
  }

  function handleDelete(id: string) {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.id} className="flex items-center justify-between bg-white/2 border border-white/5 rounded-lg p-3">
          <div>
            <div className="text-white text-sm font-medium">{user.name}</div>
            <div className="text-white/40 text-xs">{user.email}</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs hidden md:block">{ROLE_LABELS[user.role] || user.role}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${user.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
            {!!user.last_login_at && (
              <span className="text-white/20 text-xs hidden md:block">
                {new Date(user.last_login_at).toLocaleDateString('en-GB')}
              </span>
            )}
            <FirmUserActions user={user} onUpdate={handleUpdate} onDelete={handleDelete} />
          </div>
        </div>
      ))}
      {!users.length && <p className="text-white/30 text-sm py-4 text-center">No users yet.</p>}
    </div>
  )
}

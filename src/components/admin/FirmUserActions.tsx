'use client'
import { useState } from 'react'

interface User {
  id: string
  name: string
  active: boolean
}

export function FirmUserActions({
  user,
  onUpdate,
  onDelete,
}: {
  user: User
  onUpdate: (id: string, changes: Partial<User>) => void
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)

  async function toggleActive() {
    await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    })
    onUpdate(user.id, { active: !user.active })
  }

  async function handleDelete() {
    await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
    onDelete(user.id)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-red-400 text-xs">Delete?</span>
        <button onClick={handleDelete} className="text-red-400 text-xs font-medium hover:underline">Yes</button>
        <button onClick={() => setConfirming(false)} className="text-white/30 text-xs hover:underline">No</button>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={toggleActive}
        className={`text-xs transition-colors ${user.active ? 'text-yellow-400/50 hover:text-yellow-400' : 'text-green-400/50 hover:text-green-400'}`}
      >
        {user.active ? 'Deactivate' : 'Activate'}
      </button>
      <button
        onClick={() => setConfirming(true)}
        className="text-red-400/40 text-xs hover:text-red-400 transition-colors"
      >
        Delete
      </button>
    </div>
  )
}

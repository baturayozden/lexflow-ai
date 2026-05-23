'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  entityType: 'leads' | 'cases'
  entityId: string
  redirectTo?: string
}

export function DeleteButton({ entityType, entityId, redirectTo = '/admin' }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/${entityType}/${entityId}`, { method: 'DELETE' })
      router.push(redirectTo)
      router.refresh()
    } catch {
      setDeleting(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white/60 text-sm">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500/20 border border-red-500/40 text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="border border-white/20 text-white/60 text-sm px-3 py-1.5 rounded-lg hover:border-white/40 transition-colors"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="border border-red-500/30 text-red-400/70 text-sm px-4 py-2 rounded-lg hover:border-red-500/60 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  )
}

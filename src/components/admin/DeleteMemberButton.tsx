'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  memberId: string
}

export function DeleteMemberButton({ memberId }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch(`/api/team/${memberId}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      setDeleting(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 text-xs underline disabled:opacity-50"
        >
          {deleting ? '…' : 'Yes'}
        </button>
        <span className="text-white/30 text-xs">/</span>
        <button onClick={() => setConfirm(false)} className="text-white/40 text-xs underline">
          No
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-red-400/60 text-xs hover:text-red-400 transition-colors"
    >
      Remove
    </button>
  )
}

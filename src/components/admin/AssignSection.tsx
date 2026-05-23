'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
}

interface Props {
  entityType: 'leads' | 'cases'
  entityId: string
  currentAssignedTo?: string | null
}

export function AssignSection({ entityType, entityId, currentAssignedTo }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [selected, setSelected] = useState<string>(currentAssignedTo || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .catch(() => {})
  }, [])

  async function handleAssign(memberId: string) {
    setSelected(memberId)
    setSaving(true)
    setSaved(false)
    try {
      await fetch(`/api/${entityType}/${entityId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId || null }),
      })
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Assigned To</h3>
      <div className="flex items-center gap-3">
        <select
          value={selected}
          onChange={(e) => handleAssign(e.target.value)}
          disabled={saving}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 disabled:opacity-50"
        >
          <option value="">— Unassigned —</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.role})
            </option>
          ))}
        </select>
        {saving && <span className="text-white/40 text-xs">Saving…</span>}
        {saved && <span className="text-green-400 text-xs">✓ Saved</span>}
      </div>
    </div>
  )
}

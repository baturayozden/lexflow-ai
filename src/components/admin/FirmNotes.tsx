'use client'
import { useState } from 'react'

interface Note {
  id: string
  content: string
  author: string
  created_at: string
}

interface Props {
  firmId: string
  initialNotes: Note[]
}

export function FirmNotes({ firmId, initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function addNote() {
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch('/api/firm-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firmId, content }),
    })
    const note = await res.json()
    setNotes(prev => [note, ...prev])
    setContent('')
    setLoading(false)
  }

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-4">Internal Notes</h2>
      <div className="flex gap-3 mb-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={2}
          placeholder="Add a note about this firm…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none"
        />
        <button
          onClick={addNote}
          disabled={loading || !content.trim()}
          className="bg-[#c9a84c] text-[#0a1628] font-bold text-sm px-4 py-2 rounded-lg hover:bg-[#f0d080] disabled:opacity-50 self-end transition-colors"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {notes.map(n => (
          <div key={n.id} className="bg-white/2 border border-white/5 rounded-lg p-3">
            <p className="text-white/70 text-sm">{n.content}</p>
            <p className="text-white/20 text-xs mt-1">
              {n.author} · {new Date(n.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        ))}
        {!notes.length && <p className="text-white/20 text-sm">No notes yet.</p>}
      </div>
    </div>
  )
}

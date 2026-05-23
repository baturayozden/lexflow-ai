'use client'
import { useState, useEffect } from 'react'

interface Note {
  id: string
  content: string
  author: string
  created_at: string
}

interface Props {
  entityType: 'lead' | 'case'
  entityId: string
}

export function NotesSection({ entityType, entityId }: Props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/notes?entity_type=${entityType}&entity_id=${entityId}`)
      .then((r) => r.json())
      .then((d) => setNotes(d.notes || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [entityType, entityId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)

    // Optimistic update
    const optimistic: Note = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      author: 'Admin',
      created_at: new Date().toISOString(),
    }
    setNotes((prev) => [optimistic, ...prev])
    setContent('')

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: entityType, entity_id: entityId, content: optimistic.content }),
      })
      const data = await res.json()
      if (data.note) {
        setNotes((prev) => prev.map((n) => (n.id === optimistic.id ? data.note : n)))
      }
    } catch {
      // revert optimistic on error
      setNotes((prev) => prev.filter((n) => n.id !== optimistic.id))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white/2 border border-white/10 rounded-xl p-5">
      <h3 className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Notes</h3>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note…"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#c9a84c]/50 resize-none mb-2"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="bg-[#c9a84c] text-[#0a1628] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#f0d080] transition-colors disabled:opacity-40"
        >
          {submitting ? 'Saving…' : 'Add Note'}
        </button>
      </form>

      {/* Notes list */}
      {loading ? (
        <p className="text-white/30 text-sm">Loading notes…</p>
      ) : notes.length === 0 ? (
        <p className="text-white/30 text-sm">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border-t border-white/5 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#c9a84c] text-xs font-medium">{note.author}</span>
                <span className="text-white/30 text-xs">
                  {new Date(note.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  {new Date(note.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

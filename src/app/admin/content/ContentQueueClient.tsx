'use client'
import { useState, useEffect, useCallback } from 'react'
// Auth is handled by the Server Component wrapper (page.tsx)

interface Slide { n: number; heading: string; body: string }

interface RepurposedItem {
  id: string
  blog_post_id: string
  blog_title: string
  channel: 'linkedin' | 'instagram'
  format: 'text_post' | 'carousel' | 'quote_graphic' | 'caption'
  post_type: string
  content: Record<string, unknown>
  status: 'pending' | 'approved' | 'rejected' | 'posted'
  created_at: string
  approved_at: string | null
}

const CHANNEL_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
  instagram: 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
}

const FORMAT_LABELS: Record<string, string> = {
  text_post: 'Text Post',
  carousel: 'Carousel',
  quote_graphic: 'Quote',
  caption: 'Caption',
}

const POST_TYPE_COLORS: Record<string, string> = {
  problem: 'bg-red-500/10 text-red-300 border border-red-500/20',
  evidence: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
  case: 'bg-green-500/10 text-green-300 border border-green-500/20',
  positioning: 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2.5 py-1 rounded border transition-colors"
      style={copied
        ? { background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10B981' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)' }
      }
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

function ContentPreview({ item }: { item: RepurposedItem }) {
  const c = item.content

  if (item.format === 'text_post') {
    const body = (c.body as string) || ''
    const hook = (c.hook as string) || ''
    const cta = (c.cta as string) || ''
    const stat = (c.stat_used as string) || ''
    return (
      <div className="space-y-3">
        {hook && (
          <div>
            <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">Hook</p>
            <p className="text-white/80 text-sm italic leading-relaxed">{hook}</p>
          </div>
        )}
        {stat && (
          <div>
            <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">Statistic used</p>
            <p className="text-[#c9a84c] text-sm italic leading-relaxed">{stat}</p>
          </div>
        )}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/30 text-xs uppercase tracking-wider">Body</p>
            <CopyButton text={`${body}\n\n${cta}`} label="Copy post" />
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{body}</p>
        </div>
        {cta && (
          <div className="border-t border-white/8 pt-3">
            <p className="text-white/30 text-xs mb-1 uppercase tracking-wider">CTA</p>
            <p className="text-[#c9a84c] text-sm">{cta}</p>
          </div>
        )}
      </div>
    )
  }

  if (item.format === 'carousel') {
    const slides = (c.slides as Slide[]) || []
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/30 text-xs uppercase tracking-wider">8 Slides</p>
          <CopyButton
            text={slides.map(s => `Slide ${s.n}: ${s.heading}\n${s.body}`).join('\n\n')}
            label="Copy all slides"
          />
        </div>
        {slides.map((slide) => (
          <div
            key={slide.n}
            className="rounded-lg p-3 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#c9a84c] text-xs font-bold w-5">{slide.n}</span>
                  <span className="text-white font-semibold text-sm">{slide.heading}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed pl-7">{slide.body}</p>
              </div>
              <CopyButton text={`${slide.heading}\n${slide.body}`} label="Copy" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (item.format === 'quote_graphic') {
    const quote = (c.quote as string) || ''
    const context = (c.context as string) || ''
    return (
      <div className="space-y-3">
        <div
          className="rounded-xl p-6 text-center border"
          style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.2)' }}
        >
          <p className="text-[#c9a84c] text-xs mb-3 uppercase tracking-widest">Quote Graphic</p>
          <p className="text-white font-semibold text-base leading-relaxed italic mb-3">&ldquo;{quote}&rdquo;</p>
          <p className="text-white/40 text-xs">— LexFlow</p>
        </div>
        {context && <p className="text-white/30 text-xs">Context: {context}</p>}
        <div className="flex justify-end">
          <CopyButton text={`"${quote}"\n— LexFlow`} label="Copy quote" />
        </div>
      </div>
    )
  }

  if (item.format === 'caption') {
    const caption = (c.caption as string) || ''
    const hashtags = (c.hashtags as string[]) || []
    const firstComment = (c.first_comment as string) || ''
    const hashtagStr = hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ')
    return (
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/30 text-xs uppercase tracking-wider">Caption</p>
            <CopyButton text={`${caption}\n\n${hashtagStr}`} label="Copy caption" />
          </div>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{caption}</p>
        </div>
        <div className="border-t border-white/8 pt-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/30 text-xs uppercase tracking-wider">Hashtags</p>
            <CopyButton text={hashtagStr} label="Copy tags" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, i) => (
              <span key={i} className="text-blue-400/70 text-xs">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
        {firstComment && (
          <div className="border-t border-white/8 pt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/30 text-xs uppercase tracking-wider">First comment</p>
              <CopyButton text={firstComment} label="Copy" />
            </div>
            <p className="text-white/50 text-sm italic">{firstComment}</p>
          </div>
        )}
      </div>
    )
  }

  return <p className="text-white/30 text-sm">Unknown format</p>
}

export default function ContentQueueClient() {
  const [items, setItems] = useState<RepurposedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: statusFilter })
      if (channelFilter !== 'all') params.set('channel', channelFilter)
      const res = await fetch(`/api/repurpose/list?${params}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, channelFilter])

  useEffect(() => { fetchItems() }, [fetchItems])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/repurpose/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setItems((prev) => prev.map((item) =>
        item.id === id ? { ...item, status: newStatus as RepurposedItem['status'] } : item
      ))
      if (statusFilter !== 'all' && statusFilter !== newStatus) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } finally {
      setUpdating(null)
    }
  }

  const pending  = items.filter(i => i.status === 'pending').length
  const approved = items.filter(i => i.status === 'approved').length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-xl">Content Queue</h1>
          <p className="text-white/40 text-sm mt-1">
            AI-generated LinkedIn &amp; Instagram content from blog posts
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {pending > 0 && (
            <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">
              {pending} pending
            </span>
          )}
          {approved > 0 && (
            <span className="bg-green-500/10 border border-green-500/20 text-green-300 px-3 py-1 rounded-full">
              {approved} approved
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          {['pending', 'approved', 'rejected', 'posted'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-2 text-sm capitalize transition-colors"
              style={statusFilter === s
                ? { background: '#c9a84c', color: '#0a1628', fontWeight: 600 }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          {[['all', 'All'], ['linkedin', 'LinkedIn'], ['instagram', 'Instagram']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setChannelFilter(val)}
              className="px-4 py-2 text-sm transition-colors"
              style={channelFilter === val
                ? { background: 'rgba(255,255,255,0.1)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading queue…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No {statusFilter} content found.</p>
          <p className="text-white/20 text-xs mt-2">
            Go to the Blog admin and click &ldquo;Repurpose&rdquo; on a published post.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-4 p-5 border-b border-white/6">
                <div className="flex-1 min-w-0">
                  <p className="text-white/50 text-xs mb-1.5 truncate">{item.blog_title}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CHANNEL_COLORS[item.channel]}`}>
                      {item.channel}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                      {FORMAT_LABELS[item.format]}
                    </span>
                    {item.post_type && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${POST_TYPE_COLORS[item.post_type] || 'bg-white/5 text-white/40 border border-white/10'}`}>
                        {item.post_type}
                      </span>
                    )}
                    <span className="text-white/25 text-xs">
                      {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        disabled={updating === item.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
                      >
                        {updating === item.id ? '…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        disabled={updating === item.id}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button
                      onClick={() => updateStatus(item.id, 'posted')}
                      disabled={updating === item.id}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                      style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c' }}
                    >
                      Mark posted
                    </button>
                  )}
                  {item.status === 'rejected' && (
                    <button
                      onClick={() => updateStatus(item.id, 'pending')}
                      disabled={updating === item.id}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>

              {/* Content preview */}
              <div className="p-5">
                <ContentPreview item={item} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

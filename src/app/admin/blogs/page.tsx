'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  category: string
  is_published: boolean
  published_at: string
  reading_time_minutes: number
  word_count: number | null
}

const CATEGORY_LABELS: Record<string, string> = {
  immigration: 'Immigration',
  conveyancing: 'Conveyancing',
  'legal-tech': 'Legal Tech',
}

export default function AdminBlogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [repurposing, setRepurposing] = useState<string | null>(null)
  const [repurposeDone, setRepurposeDone] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
    if (status === 'authenticated') {
      const role = (session?.user as Record<string, unknown>)?.role as string
      if (role !== 'platform_admin') router.push('/admin')
    }
  }, [status, session, router])

  useEffect(() => {
    fetch('/api/admin/blogs')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const repurpose = async (post: BlogPost) => {
    setRepurposing(post.id)
    setError(null)
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogPostId: post.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setRepurposeDone(prev => new Set([...prev, post.id]))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Repurpose failed')
    } finally {
      setRepurposing(null)
    }
  }

  if (status === 'loading') return null

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-xl">Blog Posts</h1>
          <p className="text-white/40 text-sm mt-1">
            Generate LinkedIn &amp; Instagram content from any published post
          </p>
        </div>
        <Link
          href="/admin/content"
          className="text-sm px-4 py-2 rounded-lg transition-colors"
          style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c' }}
        >
          View Content Queue →
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-white/30 text-sm py-16 text-center">Loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="text-white/30 text-sm py-16 text-center">No blog posts found.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const done = repurposeDone.has(post.id)
            const busy = repurposing === post.id
            return (
              <div
                key={post.id}
                className="flex items-center gap-4 rounded-xl border p-4 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {/* Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}>
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                    {!post.is_published && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm leading-snug truncate">{post.title}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {post.reading_time_minutes ? ` · ${post.reading_time_minutes} min read` : ''}
                    {post.word_count ? ` · ${post.word_count.toLocaleString()} words` : ''}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    View
                  </a>

                  {done ? (
                    <Link
                      href="/admin/content"
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
                    >
                      ✓ In queue
                    </Link>
                  ) : (
                    <button
                      onClick={() => repurpose(post)}
                      disabled={!!repurposing || !post.is_published}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40"
                      style={busy
                        ? { background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(201,168,76,0.6)' }
                        : { background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c' }
                      }
                      title={!post.is_published ? 'Publish the post first' : 'Generate social content from this post'}
                    >
                      {busy ? (
                        <span className="flex items-center gap-1.5">
                          <span className="inline-block w-3 h-3 border border-[#c9a84c]/40 border-t-[#c9a84c] rounded-full animate-spin" />
                          Generating…
                        </span>
                      ) : '⚡ Repurpose'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-white/20 text-xs text-center mt-8">
        Repurposing generates 5 pieces of content per post (2 LinkedIn text posts, 1 carousel, 1 quote, 1 Instagram caption).
        Generation takes 15–30 seconds. Draft posts cannot be repurposed.
      </p>
    </div>
  )
}

export const revalidate = 0

import Link from 'next/link'
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog | LexFlow — AI Insights for UK Law Firms',
  description: 'Expert insights on UK immigration law, conveyancing, and how AI is transforming small law firms.',
}

const CATEGORY_LABELS: Record<string, string> = {
  immigration: 'Immigration',
  conveyancing: 'Conveyancing',
  'legal-tech': 'Legal Tech',
}

export default async function BlogPage() {
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, published_at, reading_time_minutes')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(50)

  const allPosts = posts || []

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1117 0%, #111827 50%, #0D1117 100%)', padding: '100px 24px 60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.8)', marginBottom: '12px' }}>INSIGHTS</p>
          <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: '16px' }}>Blog</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>Expert insights on immigration law, conveyancing, and legal AI.</p>
        </div>
      </div>

      {/* Posts grid */}
      <section style={{ background: '#F8FAFC', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {allPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '96px 0' }}>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>No posts yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '24px' }}>
              {allPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(15,23,42,0.08)',
                    borderRadius: '16px',
                    padding: '28px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    animationDelay: `${i * 0.08}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Category + read time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{
                      background: 'rgba(212,168,67,0.12)',
                      color: '#854F0B',
                      border: '1px solid rgba(212,168,67,0.25)',
                      borderRadius: '100px',
                      padding: '4px 12px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.05em',
                    }}>
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{post.reading_time_minutes} min read</span>
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px', lineHeight: 1.35 }}
                    className="group-hover:text-[#D4A843] transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span style={{ color: '#D4A843', fontSize: '0.9rem', fontWeight: 600 }} className="group-hover:translate-x-1 transition-transform inline-block">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

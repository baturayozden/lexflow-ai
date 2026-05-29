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

const CATEGORY_COLORS: Record<string, string> = {
  immigration: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  conveyancing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'legal-tech': 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/20',
}

export default async function BlogPage() {
  console.log('Fetching posts, SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30))
  const { data: posts, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, published_at, reading_time_minutes')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(50)
  console.log('Posts result:', posts?.length, 'Error:', error)

  const allPosts = posts || []

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Blog</h1>
          <p className="text-white/50 text-lg">Expert insights on immigration law, conveyancing, and legal AI.</p>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPosts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white/2 border border-white/10 rounded-2xl p-6 hover:border-[#c9a84c]/30 hover:bg-white/4 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS['legal-tech']}`}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <span className="text-white/25 text-xs">{post.reading_time_minutes} min read</span>
                </div>
                <h2 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-[#c9a84c] transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-white/25 text-xs">
                    {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-[#c9a84c] text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('title, meta_description, excerpt, focus_keyword, category')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) return { title: 'Post Not Found | LexFlow' }

  return {
    title: `${post.title} | LexFlow Blog`,
    description: post.meta_description || post.excerpt || '',
    keywords: post.focus_keyword || '',
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || '',
      type: 'article',
      siteName: 'LexFlow',
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 pt-32 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white/50 truncate">{post.title}</span>
        </div>

        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS['legal-tech']}`}>
            {CATEGORY_LABELS[post.category] || post.category}
          </span>
          <span className="text-white/25 text-xs">{post.reading_time_minutes} min read</span>
          <span className="text-white/25 text-xs">
            {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-white/60 text-lg leading-relaxed mb-8 border-l-2 border-[#c9a84c] pl-4">
            {post.excerpt}
          </p>
        )}

        <div className="border-t border-white/5 mb-8" />

        {/* Content */}
        <div
          className="prose prose-invert prose-gold max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:my-4
            prose-li:text-white/70 prose-li:my-1
            prose-strong:text-white
            prose-a:text-[#c9a84c] prose-a:no-underline hover:prose-a:underline
            prose-hr:border-white/10
            prose-blockquote:border-l-[#c9a84c] prose-blockquote:text-white/60"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 border border-[#c9a84c]/20 rounded-2xl p-8 bg-[#c9a84c]/5 text-center">
          <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-2">Get Started</p>
          <h3 className="text-white font-bold text-xl mb-3">Ready to save 10+ hours per week?</h3>
          <p className="text-white/50 text-sm mb-6">Book a free 20-minute audit and see exactly what can be automated in your firm.</p>
          <Link
            href="/#contact"
            className="inline-block bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-3 rounded-xl hover:bg-[#f0d080] transition-colors"
          >
            Book Free Audit →
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link href="/blog" className="text-white/40 text-sm hover:text-white transition-colors">← Back to Blog</Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}

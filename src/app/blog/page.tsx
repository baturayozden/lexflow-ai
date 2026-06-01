import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 0

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
  immigration: 'bg-blue-50/10 text-blue-400 border-blue-400/30',
  conveyancing: 'bg-emerald-50/10 text-emerald-400 border-emerald-400/30',
  'legal-tech': 'bg-violet-50/10 text-violet-400 border-violet-400/30',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, published_at, reading_time_minutes')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(50)

    if (!error && data) posts = data
  } catch (e) {
    console.error('Blog fetch error:', e)
  }

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <div className="bg-[#0d1f3c] border-b border-white/10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-400 text-sm font-medium uppercase tracking-widest mb-3">LexFlow Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Insights for UK Law Firms
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Practical guidance on immigration law, conveyancing, and how AI is reshaping small legal practices in the UK.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {featured && (
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Latest</p>
            <Link href={`/blog/${featured.slug}`} className="group block border border-white/10 rounded-2xl p-8 hover:border-yellow-400/40 hover:bg-white/5 transition-all duration-200">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[featured.category] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                  {CATEGORY_LABELS[featured.category] || featured.category}
                </span>
                <span className="text-sm text-slate-400">{featured.reading_time_minutes} min read</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-yellow-400 font-medium text-sm">
                Read article →
              </div>
            </Link>
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border border-white/10 rounded-xl p-6 hover:border-yellow-400/40 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.reading_time_minutes} min</span>
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                <p className="text-xs text-slate-500 mt-4">
                  {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">No posts yet — check back soon.</p>
          </div>
        )}
      </div>
    </main>
  )
}

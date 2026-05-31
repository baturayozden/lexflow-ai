import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://lexflow.co.uk', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://lexflow.co.uk/why-not-harvey', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://lexflow.co.uk/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return staticUrls
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('is_published', true)

    const blogUrls: MetadataRoute.Sitemap = (posts || []).map(p => ({
      url: `https://lexflow.co.uk/blog/${p.slug}`,
      lastModified: new Date(p.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticUrls, ...blogUrls]
  } catch {
    return staticUrls
  }
}

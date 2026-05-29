CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_description TEXT,
  focus_keyword TEXT,
  category TEXT DEFAULT 'immigration',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT TRUE,
  reading_time_minutes INT DEFAULT 5,
  word_count INT
);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published_at DESC) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "blog_posts_service_write" ON blog_posts FOR ALL USING (auth.role() = 'service_role');

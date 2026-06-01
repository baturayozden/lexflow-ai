-- Content Repurpose Engine: stores AI-generated LinkedIn/Instagram content
-- derived from published blog posts, pending admin approval before use.

CREATE TABLE IF NOT EXISTS repurposed_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id  UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  blog_title    TEXT,
  channel       TEXT NOT NULL,          -- 'linkedin' | 'instagram'
  format        TEXT NOT NULL,          -- 'text_post' | 'carousel' | 'quote_graphic' | 'caption'
  post_type     TEXT,                   -- 'problem' | 'evidence' | 'case' | 'positioning'
  content       JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected' | 'posted'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  approved_at   TIMESTAMPTZ,
  posted_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS repurposed_content_blog_idx    ON repurposed_content(blog_post_id);
CREATE INDEX IF NOT EXISTS repurposed_content_status_idx  ON repurposed_content(status);
CREATE INDEX IF NOT EXISTS repurposed_content_channel_idx ON repurposed_content(channel);
CREATE INDEX IF NOT EXISTS repurposed_content_created_idx ON repurposed_content(created_at DESC);

ALTER TABLE repurposed_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "repurposed_content_service" ON repurposed_content
  FOR ALL USING (auth.role() = 'service_role');

-- Grant access to Supabase roles (required when creating tables via SQL)
GRANT ALL ON TABLE repurposed_content TO postgres;
GRANT ALL ON TABLE repurposed_content TO service_role;
GRANT ALL ON TABLE repurposed_content TO authenticated;
GRANT ALL ON TABLE repurposed_content TO anon;

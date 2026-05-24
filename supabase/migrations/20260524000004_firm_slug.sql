ALTER TABLE public.firms ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Generate slugs for existing firms
UPDATE public.firms
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Add index
CREATE UNIQUE INDEX IF NOT EXISTS firms_slug_idx ON public.firms(slug);

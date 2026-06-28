import type { Metadata } from 'next'
import { getFirmBySlug } from '@/lib/auth-db'
import { notFound } from 'next/navigation'
import { PublicIntakeForm } from '@/components/PublicIntakeForm'

// Public per-firm intake form — self-canonical (dedupes the ?embed=true variant).
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return {
    robots: { index: false, follow: false },
    alternates: { canonical: `/intake/${slug}` },
  }
}

export default async function PublicIntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ embed?: string }>
}) {
  const { slug } = await params
  const { embed } = await searchParams
  const isEmbed = embed === 'true'
  const firm = await getFirmBySlug(slug)

  if (!firm) notFound()

  const f = firm as Record<string, unknown>
  const primaryColor = (f.primary_color as string) || '#c9a84c'
  const firmName = f.name as string

  if (isEmbed) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-4">
        <PublicIntakeForm
          firmId={f.id as string}
          firmName={firmName}
          primaryColor={primaryColor}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Firm branded header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {f.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.logo_url as string} alt={firmName} className="h-8 w-auto" />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              {firmName.charAt(0)}
            </div>
          )}
          <span className="text-white font-semibold">{firmName}</span>
          <span className="text-white/20 text-sm ml-auto">
            Powered by <span style={{ color: primaryColor }}>LexFlow</span>
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-2xl">Free Initial Consultation</h1>
          <p className="text-white/50 text-sm mt-2">
            Fill in your details and we will get back to you within one business day.
          </p>
        </div>
        <PublicIntakeForm
          firmId={f.id as string}
          firmName={firmName}
          primaryColor={primaryColor}
        />
      </div>

      <div className="text-center pb-8">
        <p className="text-white/20 text-xs">
          🔒 Your information is secure and will only be shared with {firmName}.
        </p>
      </div>
    </div>
  )
}

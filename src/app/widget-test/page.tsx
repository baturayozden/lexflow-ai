import type { Metadata } from 'next'

// Internal test page — never index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function WidgetTestPage() {
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', background: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ color: '#333' }}>Test Law Firm Website</h1>
        <p>This is a sample law firm website. The LexFlow widgets are loaded below.</p>
        <p>You should see: a chat bubble (bottom right) and a &quot;Book a Consultation&quot; button (bottom left).</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="/widget.js" data-slug="law-test" data-color="#c9a84c" data-position="bottom-left" async></script>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="/chatbot.js" data-slug="law-test" data-color="#c9a84c" data-firm="Law test" async></script>
    </>
  )
}

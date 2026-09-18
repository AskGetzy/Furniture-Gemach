import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Zeh M'zeh — Community Furniture Giveaways & Sales"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* sofa emoji */}
        <div style={{ fontSize: 120, lineHeight: 1, marginBottom: 24 }}>🛋️</div>

        {/* Hebrew name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#065f46',
            letterSpacing: '-2px',
            marginBottom: 8,
          }}
        >
          זה מזה
        </div>

        {/* English name */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#047857',
            letterSpacing: '-1px',
            marginBottom: 20,
          }}
        >
          Zeh M&apos;zeh
        </div>

        {/* tagline */}
        <div
          style={{
            fontSize: 26,
            color: '#374151',
            textAlign: 'center',
            maxWidth: 760,
          }}
        >
          Community furniture giveaways &amp; sales · Monsey, Monroe, Brooklyn, Lakewood
        </div>

        {/* domain pill */}
        <div
          style={{
            marginTop: 36,
            background: '#065f46',
            color: '#fff',
            borderRadius: 999,
            padding: '10px 32px',
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          zehmzeh.com
        </div>
      </div>
    ),
    { ...size }
  )
}

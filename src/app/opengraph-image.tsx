import { ImageResponse } from 'next/og'

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
        <div style={{ fontSize: 120, lineHeight: 1, marginBottom: 28 }}>🛋️</div>

        {/* name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#065f46',
            letterSpacing: '-3px',
            marginBottom: 16,
          }}
        >
          Zeh M&apos;zeh
        </div>

        {/* tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#374151',
            textAlign: 'center',
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          Community furniture giveaways &amp; sales
        </div>

        {/* location line */}
        <div
          style={{
            fontSize: 22,
            color: '#6b7280',
            textAlign: 'center',
          }}
        >
          Monsey · Monroe · Brooklyn · Lakewood
        </div>

        {/* domain pill */}
        <div
          style={{
            marginTop: 44,
            background: '#065f46',
            color: '#fff',
            borderRadius: 999,
            padding: '12px 36px',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}
        >
          zehmzeh.com
        </div>
      </div>
    ),
    { ...size }
  )
}

import { ImageResponse } from 'next/og'

export const alt = "Zeh M'zeh — Community Furniture Giveaways & Sales"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const sofaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 54" fill="none"><rect x="3" y="16" width="13" height="26" rx="4" stroke="#1F5D40" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="72" y="16" width="13" height="26" rx="4" stroke="#1F5D40" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="16" y="10" width="56" height="18" rx="4" stroke="#1F5D40" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="16" y="28" width="56" height="14" rx="3" stroke="#1F5D40" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="35" y1="28" x2="35" y2="42" stroke="#1F5D40" stroke-width="6" stroke-linecap="round"/><line x1="53" y1="28" x2="53" y2="42" stroke="#1F5D40" stroke-width="6" stroke-linecap="round"/><line x1="22" y1="42" x2="22" y2="51" stroke="#1F5D40" stroke-width="5" stroke-linecap="round"/><line x1="66" y1="42" x2="66" y2="51" stroke="#1F5D40" stroke-width="5" stroke-linecap="round"/></svg>`

const sofaDataUri = `data:image/svg+xml;base64,${btoa(sofaSvg)}`

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
        {/* SVG sofa mark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sofaDataUri} width={220} height={135} style={{ marginBottom: 28 }} alt="" />

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

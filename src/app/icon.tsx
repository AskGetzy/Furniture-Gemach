import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const G = '#1F5D40'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f0fdf4',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        {/* Sofa rendered with CSS boxes for satori */}
        <div style={{ position: 'relative', width: 26, height: 20, display: 'flex' }}>
          {/* Back cushion */}
          <div style={{
            position: 'absolute', top: 0, left: 4, right: 4, height: 9,
            border: `2.5px solid ${G}`, borderRadius: 2,
          }} />
          {/* Left armrest */}
          <div style={{
            position: 'absolute', top: 3, left: 0, width: 5, height: 13,
            border: `2.5px solid ${G}`, borderRadius: 2,
          }} />
          {/* Right armrest */}
          <div style={{
            position: 'absolute', top: 3, right: 0, width: 5, height: 13,
            border: `2.5px solid ${G}`, borderRadius: 2,
          }} />
          {/* Seat */}
          <div style={{
            position: 'absolute', top: 9, left: 4, right: 4, height: 7,
            border: `2.5px solid ${G}`, borderRadius: 2,
          }} />
          {/* Left seat divider */}
          <div style={{
            position: 'absolute', top: 9, left: 11, width: 2, height: 7,
            background: G,
          }} />
          {/* Right seat divider */}
          <div style={{
            position: 'absolute', top: 9, right: 11, width: 2, height: 7,
            background: G,
          }} />
          {/* Left leg */}
          <div style={{
            position: 'absolute', bottom: -3, left: 6, width: 2, height: 3,
            background: G, borderRadius: 1,
          }} />
          {/* Right leg */}
          <div style={{
            position: 'absolute', bottom: -3, right: 6, width: 2, height: 3,
            background: G, borderRadius: 1,
          }} />
        </div>
      </div>
    ),
    { ...size }
  )
}

import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

const SIZE = { width: 1200, height: 630 }

// Rosé Pine (Moon) — matches the site palette
const C = {
  base: '#232136',
  surface: '#2a273f',
  text: '#e0def4',
  subtle: '#908caa',
  muted: '#6e6a86',
  rose: '#ea9a97',
  iris: '#c4a7e7',
  foam: '#9ccfd8',
}

// Best-effort: load the site's signature font. If the fetch fails, the card
// falls back to the default sans and still renders.
async function loadFont(weight: 'Regular' | 'Bold'): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@v2.304/fonts/ttf/JetBrainsMono-${weight}.ttf`,
    )
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const title = (searchParams.get('title') || 'Heart of Gold').slice(0, 140)
  const subtitle = (searchParams.get('subtitle') || '').slice(0, 160)
  const eyebrow = (searchParams.get('eyebrow') || 'heart of gold').slice(0, 60)
  const showProfile = searchParams.get('profile') === '1'

  const [regular, bold] = await Promise.all([loadFont('Regular'), loadFont('Bold')])
  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] = []
  if (regular) fonts.push({ name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' })
  if (bold) fonts.push({ name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' })
  const fontFamily = fonts.length ? 'JetBrains Mono' : 'monospace'

  const titleSize = title.length > 70 ? 52 : title.length > 40 ? 64 : 76

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: C.base,
          backgroundImage: `linear-gradient(135deg, ${C.surface} 0%, ${C.base} 60%)`,
          padding: 80,
          fontFamily,
        }}
      >
        {/* top */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                backgroundColor: C.rose,
                display: 'flex',
                marginRight: 18,
              }}
            />
            <div style={{ display: 'flex', fontSize: 28, color: C.subtle, letterSpacing: 1 }}>
              {eyebrow}
            </div>
          </div>
          {showProfile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${origin}/ondrej-profile.png`}
              width={132}
              height={132}
              alt=""
              style={{
                width: 132,
                height: 132,
                borderRadius: 9999,
                objectFit: 'cover',
                border: `3px solid ${C.muted}`,
              }}
            />
          ) : null}
        </div>

        {/* title block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.12,
              maxWidth: 1010,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 30,
                color: C.subtle,
                lineHeight: 1.35,
                maxWidth: 1010,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* bottom */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, color: C.muted }}>
          <div style={{ display: 'flex', color: C.foam }}>writing</div>
          <div style={{ display: 'flex', margin: '0 14px' }}>·</div>
          <div style={{ display: 'flex', color: C.iris }}>wandering</div>
          <div style={{ display: 'flex', margin: '0 14px' }}>·</div>
          <div style={{ display: 'flex', color: C.rose }}>making</div>
          <div style={{ display: 'flex', marginLeft: 'auto', color: C.muted }}>ondrejsvec.com</div>
        </div>
      </div>
    ),
    { ...SIZE, fonts: fonts.length ? fonts : undefined },
  )
}

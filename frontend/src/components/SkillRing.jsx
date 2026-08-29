import { useEffect, useRef } from 'react'

export default function SkillRing({
  pct   = 0,
  size  = 80,
  stroke = 10,
  color  = '#00b4d8',
  label  = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width  = size * dpr
    canvas.height = size * dpr
    canvas.style.width  = `${size}px`
    canvas.style.height = `${size}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const cx     = size / 2
    const cy     = size / 2
    const radius = (size - stroke) / 2
    const start  = -Math.PI / 2
    const end    = start + (Math.PI * 2 * Math.min(Math.max(pct, 0), 100)) / 100

    // Track
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth   = stroke
    ctx.lineCap     = 'round'
    ctx.stroke()

    // Arc fill
    if (pct > 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, radius, start, end)
      ctx.strokeStyle = color
      ctx.lineWidth   = stroke
      ctx.lineCap     = 'round'
      ctx.stroke()
    }

    // Center text
    ctx.fillStyle   = '#e6edf3'
    ctx.font        = `700 ${Math.round(size * 0.22)}px Syne, sans-serif`
    ctx.textAlign   = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.round(pct)}%`, cx, cy)
  }, [pct, size, stroke, color])

  return (
    <div className="flex flex-col items-center gap-1.5">
      <canvas ref={canvasRef} />
      {label && (
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
      )}
    </div>
  )
}

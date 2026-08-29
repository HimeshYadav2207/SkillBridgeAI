import { useEffect, useRef } from 'react'

export default function ParticleBackground({ count = 70, dark = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
    }))

    const LINE_DIST = 140
    const DOT_COLOR = dark ? 'rgba(147,197,253,' : 'rgba(59,130,246,'
    const LINE_COLOR = dark ? 'rgba(147,197,253,' : 'rgba(59,130,246,'

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINE_DIST) {
            const alpha = (1 - dist / LINE_DIST) * (dark ? 0.2 : 0.12)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = LINE_COLOR + alpha + ')'
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Dots
      const t = performance.now() / 1000
      particles.forEach(p => {
        const glow = 0.3 + 0.15 * Math.sin(t * 0.8 + p.pulse)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = DOT_COLOR + glow + ')'
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count, dark])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

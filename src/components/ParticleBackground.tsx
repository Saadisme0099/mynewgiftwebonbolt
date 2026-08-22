import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  rotation: number
  rotSpeed: number
}

interface Props {
  color?: string
  density?: number
  shape?: 'heart' | 'circle' | 'star'
}

export default function ParticleBackground({ color = '#FF2882', density = 40, shape = 'heart' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const createParticles = () => {
      particles = []
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 6 + Math.random() * 14,
          speedY: -(0.3 + Math.random() * 0.8),
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: 0.1 + Math.random() * 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
        })
      }
    }
    createParticles()

    const drawHeart = (x: number, y: number, size: number, alpha: number, rot: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      const s = size / 14
      ctx.moveTo(0, 3 * s)
      ctx.bezierCurveTo(-7 * s, -4 * s, -7 * s, -8 * s, 0, -4 * s)
      ctx.bezierCurveTo(7 * s, -8 * s, 7 * s, -4 * s, 0, 3 * s)
      ctx.fill()
      ctx.restore()
    }

    const drawCircle = (x: number, y: number, size: number, alpha: number) => {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawStar = (x: number, y: number, size: number, alpha: number, rot: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.beginPath()
      const outer = size / 2
      const inner = outer * 0.4
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
        const a2 = angle + Math.PI / 5
        ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.rotSpeed
        if (p.y < -20) {
          p.y = canvas.height + 20
          p.x = Math.random() * canvas.width
        }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        if (shape === 'heart') drawHeart(p.x, p.y, p.size, p.opacity, p.rotation)
        else if (shape === 'circle') drawCircle(p.x, p.y, p.size, p.opacity)
        else drawStar(p.x, p.y, p.size, p.opacity, p.rotation)
      })
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [color, density, shape])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

import confetti from 'canvas-confetti'

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#E91E63', '#FF2882', '#FFD700', '#FF80AB', '#F8BBD0'],
  })
}

export function fireBigConfetti() {
  const end = Date.now() + 1000
  const colors = ['#E91E63', '#FF2882', '#FFD700', '#FF80AB']
    ; (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
}

export function fireHeartConfetti() {
  const scalar = 2
  const heart = confetti.shapeFromText({ text: '💖', scalar })
  confetti({
    scalar,
    spread: 360,
    particleCount: 30,
    origin: { y: 0.5 },
    shapes: [heart],
    colors: ['#FF2882', '#E91E63', '#FF80AB'],
  })
}

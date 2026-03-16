import { useRef, useCallback } from 'react'

// Synthesize simple sounds using Web Audio API — no external files needed
function createAudioContext() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || window.webkitAudioContext)()
}

function playTone(ctx, freq, duration, type = 'sine', gain = 0.3) {
  if (!ctx) return
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.type = type
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
  gainNode.gain.setValueAtTime(gain, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

export function useSound() {
  const ctxRef = useRef(null)

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext()
    }
    return ctxRef.current
  }

  const playCheer = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    // Quick ascending fanfare
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  }, [])

  const playTick = useCallback(() => {
    playTone(getCtx(), 880, 0.08, 'square', 0.15)
  }, [])

  const playWhistle = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 1200, 0.4, 'sine', 0.3)
    setTimeout(() => playTone(ctx, 900, 0.3, 'sine', 0.2), 300)
  }, [])

  const playCardDeal = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    for (let i = 0; i < 4; i++) {
      setTimeout(() => playTone(ctx, 400 + i * 60, 0.1, 'square', 0.1), i * 70)
    }
  }, [])

  const playVictory = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523, 659, 784, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const t = i * 0.15
      playTone(ctx, freq, 0.35, 'triangle', 0.25)
    })
  }, [])

  const playGoalHorn = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    playTone(ctx, 220, 0.8, 'sawtooth', 0.25)
    setTimeout(() => playTone(ctx, 330, 0.5, 'sawtooth', 0.2), 400)
  }, [])

  const playSplash = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    // Descending tone for splash
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  }, [])

  return { playCheer, playTick, playWhistle, playCardDeal, playVictory, playGoalHorn, playSplash }
}

import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(duration, onExpire) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const start = useCallback((dur) => {
    setTimeLeft(dur ?? duration)
    setRunning(true)
  }, [duration])

  const stop = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
  }, [])

  const reset = useCallback((dur) => {
    stop()
    setTimeLeft(dur ?? duration)
  }, [stop, duration])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  const progress = duration > 0 ? timeLeft / duration : 0
  const isLow = timeLeft <= 5 && running

  return { timeLeft, running, progress, isLow, start, stop, reset }
}

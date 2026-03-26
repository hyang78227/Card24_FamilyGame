import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlayerButton } from './PlayerButton.jsx'
import { PlayingCard } from './PlayingCard.jsx'
import { useTimer } from '../hooks/useTimer.js'
import { useSound } from '../hooks/useSound.js'

export function GameScreen({
  activePlayers,
  cards,
  scores,
  round,
  settings,
  solution,
  onAwardPoint,
  onNextRound,
  onStop,
  getScore,
}) {
  const [showScores, setShowScores] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const peekTimeoutRef = useRef(null)
  const { playTick, playWhistle, playCardDeal } = useSound()

  const timer = useTimer(settings.timerDuration, () => {
    setTimedOut(true)
    playWhistle()
  })

  // Start timer when round changes (if timer is on)
  useEffect(() => {
    setTimedOut(false)
    if (settings.timerOn) {
      timer.start(settings.timerDuration)
    } else {
      timer.stop()
    }
    playCardDeal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  // Beep when timer is low
  useEffect(() => {
    if (timer.isLow && settings.timerOn) {
      playTick()
    }
  }, [timer.timeLeft])

  function handlePeek() {
    setShowScores(true)
    clearTimeout(peekTimeoutRef.current)
    peekTimeoutRef.current = setTimeout(() => setShowScores(false), 3000)
  }

  function handleAwardPoint(playerId) {
    if (timedOut) return
    timer.stop()
    onAwardPoint(playerId)
    setTimedOut(false)
  }

  function handleNextRound() {
    setTimedOut(false)
    onNextRound()
  }

  return (
    <div className="flex flex-col bg-white overflow-hidden" style={{ height: '100dvh' }}>
      {/* Top bar */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3"
        style={{ background: '#1E3A5F' }}
      >
        <span className="text-white font-black text-lg">Round {round}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePeek}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            👁 Peek
          </button>
          <button
            onClick={onStop}
            className="px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: '#DC2626', color: 'white' }}
          >
            Stop
          </button>
        </div>
      </div>

      {/* Timer bar */}
      {settings.timerOn && (
        <div className="shrink-0 h-2 bg-gray-200 w-full">
          <motion.div
            className="h-full rounded-r"
            style={{
              background: timer.isLow ? '#DC2626' : '#22c55e',
              width: `${timer.progress * 100}%`,
            }}
            animate={{ width: `${timer.progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      {settings.timerOn && (
        <div className="shrink-0 text-center text-xs font-bold mt-0.5"
          style={{ color: timer.isLow ? '#DC2626' : '#6b7280' }}
        >
          {timer.timeLeft}s
        </div>
      )}

      {/* Cards — 2×2 grid, dominant */}
      <div className="flex-1 min-h-0 px-4 pt-3 pb-1 flex items-center justify-center">
        <div className="grid grid-cols-2" style={{ gap: '16px' }}>
          {cards.map((card, i) => (
            <div key={`${round}-${i}`} className="flex items-center justify-center">
              <PlayingCard card={card} index={i} dealt fill />
            </div>
          ))}
        </div>
      </div>

      {/* Solution + instructions (compact) */}
      <div className="shrink-0 px-4 py-1">
        <AnimatePresence>
          {solution && timedOut && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-1 px-4 py-1.5 rounded-xl text-center"
              style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}
            >
              <span className="text-green-700 font-bold text-sm">💡 {solution} = 24</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!timedOut ? (
          <p className="text-center text-gray-400 text-xs">
            Tap the winner's photo to award a point
          </p>
        ) : (
          <p className="text-center text-red-500 text-xs font-bold">
            ⏱ Time's up! No point this round.
          </p>
        )}
      </div>

      {/* Next round / Skip buttons */}
      <div className="shrink-0 px-4 pb-2 flex gap-3">
        {timedOut ? (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNextRound}
            className="flex-1 py-3 rounded-2xl font-bold text-white text-base"
            style={{ background: '#1E3A5F' }}
          >
            Next Round →
          </motion.button>
        ) : (
          <button
            onClick={handleNextRound}
            className="flex-1 py-3 rounded-2xl font-bold text-base"
            style={{ background: '#f3f4f6', color: '#6b7280' }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Player avatars — single compact row */}
      <div className="shrink-0 flex flex-row justify-around items-start px-4 py-2 pb-4">
        {activePlayers.map(player => (
          <PlayerButton
            key={player.id}
            player={player}
            score={getScore(player.id)}
            showScore={showScores}
            onPress={() => handleAwardPoint(player.id)}
            disabled={timedOut}
            size="sm"
          />
        ))}
      </div>
    </div>
  )
}

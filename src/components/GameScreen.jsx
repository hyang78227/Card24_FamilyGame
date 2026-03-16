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

  const playerGrid = activePlayers.length <= 2
    ? 'grid-cols-2'
    : activePlayers.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2'

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3"
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
        <div className="h-2 bg-gray-200 w-full">
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
        <div className="text-center text-xs font-bold mt-0.5"
          style={{ color: timer.isLow ? '#DC2626' : '#6b7280' }}
        >
          {timer.timeLeft}s
        </div>
      )}

      {/* Cards */}
      <div className="flex justify-center gap-3 px-4 py-6">
        {cards.map((card, i) => (
          <PlayingCard key={`${round}-${i}`} card={card} index={i} dealt />
        ))}
      </div>

      {/* Solution (if enabled + timed out / visible) */}
      <AnimatePresence>
        {solution && timedOut && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mb-2 px-4 py-2 rounded-xl text-center"
            style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}
          >
            <span className="text-green-700 font-bold text-sm">💡 {solution} = 24</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!timedOut ? (
        <p className="text-center text-gray-400 text-sm px-4 mb-2">
          Tap the winner's photo to award a point
        </p>
      ) : (
        <p className="text-center text-red-500 text-sm font-bold px-4 mb-2">
          ⏱ Time's up! No point this round.
        </p>
      )}

      {/* Player buttons */}
      <div className={`grid ${playerGrid} gap-4 px-6 py-4 flex-1 content-start`}>
        {activePlayers.map(player => (
          <div key={player.id} className="flex justify-center">
            <PlayerButton
              player={player}
              score={getScore(player.id)}
              showScore={showScores}
              onPress={() => handleAwardPoint(player.id)}
              disabled={timedOut}
              size="lg"
            />
          </div>
        ))}
      </div>

      {/* Next round button (after timeout) */}
      {timedOut && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-6"
        >
          <button
            onClick={handleNextRound}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg"
            style={{ background: '#1E3A5F' }}
          >
            Next Round →
          </button>
        </motion.div>
      )}
    </div>
  )
}

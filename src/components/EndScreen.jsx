import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnnouncer } from '../hooks/useAnnouncer.js'
import { useSound } from '../hooks/useSound.js'

function Confetti({ players }) {
  const dots = Array.from({ length: 40 }).map((_, i) => {
    const player = players[i % players.length]
    return {
      id: i,
      color: i % 2 === 0 ? player.themeColor : player.accentColor,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 0.5,
      size: 6 + Math.floor(Math.random() * 8),
    }
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-sm"
          style={{
            width: d.size,
            height: d.size,
            background: d.color,
            left: d.left,
            top: -20,
          }}
          animate={{ y: '110vh', rotate: 360 * (1 + (d.id % 3)), opacity: [1, 1, 0] }}
          transition={{ delay: d.delay, duration: 2 + Math.random(), ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

export function EndScreen({ activePlayers, getScore, round, isTie, onPlayAgain, onSuddenDeath }) {
  const [showFlip, setShowFlip] = useState(false)
  const { announceWinner, announceSuddenDeath } = useAnnouncer()
  const { playVictory } = useSound()

  // Sort by score descending
  const sorted = [...activePlayers].sort((a, b) => getScore(b.id) - getScore(a.id))
  const winner = sorted[0]
  const topScore = getScore(winner.id)
  const tied = activePlayers.filter(p => getScore(p.id) === topScore)
  const hasTie = tied.length > 1

  useEffect(() => {
    playVictory()
    if (hasTie) {
      announceSuddenDeath()
    } else {
      announceWinner(winner.name)
    }
    const t = setTimeout(() => setShowFlip(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      <Confetti players={activePlayers} />

      {/* Header */}
      <div className="text-center pt-8 pb-4 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="text-5xl mb-2"
        >
          {hasTie ? '🤝' : '🏆'}
        </motion.div>
        <h1 className="font-black text-3xl" style={{ color: '#1E3A5F' }}>
          {hasTie ? "It's a Tie!" : `${winner.name} Wins!`}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{round - 1} rounds played</p>
      </div>

      {/* Scoreboard */}
      <div className="flex-1 px-4 py-2 z-10">
        <div className="flex flex-col gap-3">
          {sorted.map((player, idx) => {
            const isWinner = getScore(player.id) === topScore
            const isFlipped = showFlip && isWinner && !hasTie && player.id === winner.id

            return (
              <motion.div
                key={player.id}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                style={{
                  background: isWinner ? `${player.themeColor}15` : '#f8f9fa',
                  border: `2px solid ${isWinner ? player.themeColor : '#e5e7eb'}`,
                }}
              >
                {/* Rank */}
                <span className="text-2xl w-8 text-center">
                  {idx === 0 ? (hasTie ? '🤝' : '👑') : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '4️⃣'}
                </span>

                {/* Photo / emoji */}
                <motion.div
                  animate={isFlipped ? { rotateY: [0, 180, 360] } : {}}
                  transition={{ duration: 0.8 }}
                  style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    border: `3px solid ${player.themeColor}`,
                    overflow: 'hidden',
                    background: `${player.themeColor}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {player.photo ? (
                    <img src={player.photo} alt={player.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>{player.emoji}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  <p className="font-black text-base" style={{ color: player.themeColor }}>
                    {player.name}
                  </p>
                  <p className="text-gray-400 text-xs">{player.role}</p>
                </div>

                <div className="text-right">
                  <p className="font-black text-2xl" style={{ color: player.accentColor }}>
                    {getScore(player.id)}
                  </p>
                  <p className="text-gray-400 text-xs">pts</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-8 z-10 flex flex-col gap-3">
        {hasTie && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSuddenDeath}
            className="w-full py-4 rounded-2xl font-black text-xl text-white"
            style={{ background: 'linear-gradient(135deg, #DC2626, #991b1b)' }}
          >
            ⚡ Sudden Death!
          </motion.button>
        )}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5491)' }}
        >
          Play Again
        </motion.button>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAnnouncer } from '../hooks/useAnnouncer.js'
import { useSound } from '../hooks/useSound.js'

function HonglingCelebration() {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f1f33 100%)' }}
    >
      {/* Yellow card flash */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: [0, 1.3, 1], rotate: [-20, 5, 0] }}
        transition={{ duration: 0.5 }}
        className="mb-6"
        style={{
          width: 80, height: 112,
          background: '#FFD700',
          borderRadius: 8,
          border: '3px solid #BA7517',
          boxShadow: '0 0 40px #FFD700aa',
        }}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.3 }}
        className="text-6xl"
      >
        ⚖️
      </motion.div>
      {/* Navy burst rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ border: '2px solid #BA7517', width: 80, height: 80 }}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 3 + i, opacity: 0 }}
          transition={{ delay: i * 0.15, duration: 0.7 }}
        />
      ))}
    </motion.div>
  )
}

function JayCelebration() {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #BA7517 0%, #7a4e0f 100%)' }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], y: [0, -12, 0] }}
        transition={{ repeat: 2, duration: 0.5 }}
        className="text-8xl mb-4"
      >
        🧸
      </motion.div>
      {/* Soft expanding amber rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ border: '3px solid #EF9F27', width: 100, height: 100, opacity: 0.7 }}
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 2.5 + i * 0.8, opacity: 0 }}
          transition={{ delay: i * 0.2, duration: 0.8 }}
        />
      ))}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white font-black text-2xl"
      >
        Great job, Jay! 🌟
      </motion.div>
    </motion.div>
  )
}

function JaysonCelebration() {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #3B6D11 0%, #1e3a08 100%)' }}
    >
      {/* Soccer ball rolling across */}
      <motion.div
        initial={{ x: -160, rotate: 0 }}
        animate={{ x: 160, rotate: 720 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="text-6xl absolute"
        style={{ top: '35%' }}
      >
        ⚽
      </motion.div>

      {/* Jayson name bouncing */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [40, -10, 0], opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
        className="font-black text-4xl"
        style={{ color: '#639922', textShadow: '2px 2px 0 #fff', marginTop: 40 }}
      >
        JAYSON!
      </motion.div>

      {/* Green confetti dots */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 10, height: 10,
            background: i % 2 === 0 ? '#639922' : '#ffffff',
            left: `${10 + (i * 5.5) % 80}%`,
            top: '-10px',
          }}
          animate={{ y: '110vh', rotate: 360 * (i % 3 + 1) }}
          transition={{ delay: i * 0.07, duration: 1, ease: 'easeIn' }}
        />
      ))}
    </motion.div>
  )
}

function JiaoCelebration() {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #185FA5 0%, #0a2f52 100%)' }}
    >
      {/* Water splash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 2.5], opacity: [1, 0] }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute"
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #60a5fa 0%, #185FA5 60%, transparent 100%)',
        }}
      />

      {/* Jiao name floating up */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: -20, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7, type: 'spring', stiffness: 120 }}
        className="font-black text-4xl z-10"
        style={{ color: '#ffffff', textShadow: '0 0 20px #993556' }}
      >
        🩰 Jiao! 🩰
      </motion.div>

      {/* Bubbles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 8 + (i % 3) * 6,
            height: 8 + (i % 3) * 6,
            background: i % 2 === 0 ? '#993556aa' : '#60a5faaa',
            left: `${15 + (i * 6.5) % 70}%`,
            bottom: '20%',
          }}
          animate={{ y: -200 - i * 15, opacity: [1, 0] }}
          transition={{ delay: i * 0.09, duration: 0.9 + i * 0.05 }}
        />
      ))}
    </motion.div>
  )
}

const CELEBRATIONS = {
  hongling: HonglingCelebration,
  jay: JayCelebration,
  jayson: JaysonCelebration,
  jiao: JiaoCelebration,
}

export function CelebrationScreen({ player, onDone }) {
  const { announcePoint } = useAnnouncer()
  const { playCheer, playGoalHorn, playSplash } = useSound()

  useEffect(() => {
    announcePoint(player.name)
    if (player.id === 'jayson') playGoalHorn()
    else if (player.id === 'jiao') playSplash()
    else playCheer()

    const timer = setTimeout(onDone, 1500)
    return () => clearTimeout(timer)
  }, [])

  const CelebComp = CELEBRATIONS[player.id] || (() => (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: player.themeColor }}
    >
      <span className="text-white font-black text-3xl">{player.name}! 🎉</span>
    </div>
  ))

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <CelebComp />

      {/* Player name overlay at top */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-2 rounded-full"
          style={{ background: 'rgba(0,0,0,0.35)' }}
        >
          <span className="text-white font-black text-xl">
            +1 Point → {player.name}!
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

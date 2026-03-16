import { motion } from 'framer-motion'
import { rankLabel, isRedSuit } from '../utils/cardUtils.js'

export function PlayingCard({ card, index = 0, dealt = false }) {
  const red = isRedSuit(card.suit)
  const color = red ? '#DC2626' : '#1a1a1a'

  return (
    <motion.div
      initial={dealt ? { y: -60, opacity: 0, scale: 0.7 } : false}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl card-shadow flex flex-col items-center justify-between p-2 select-none no-select"
      style={{
        width: 72,
        height: 100,
        border: '1.5px solid #e5e7eb',
      }}
    >
      {/* Top-left rank + suit */}
      <div className="self-start leading-none" style={{ color, fontSize: 14, fontWeight: 700 }}>
        <div>{card.label}</div>
        <div style={{ fontSize: 12 }}>{card.suit}</div>
      </div>

      {/* Center suit */}
      <div style={{ color, fontSize: 28, lineHeight: 1 }}>{card.suit}</div>

      {/* Bottom-right rank + suit (rotated) */}
      <div
        className="self-end leading-none"
        style={{ color, fontSize: 14, fontWeight: 700, transform: 'rotate(180deg)' }}
      >
        <div>{card.label}</div>
        <div style={{ fontSize: 12 }}>{card.suit}</div>
      </div>
    </motion.div>
  )
}

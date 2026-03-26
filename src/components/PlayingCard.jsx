import { motion } from 'framer-motion'
import { rankLabel, isRedSuit } from '../utils/cardUtils.js'

export function PlayingCard({ card, index = 0, dealt = false, fill = false }) {
  const red = isRedSuit(card.suit)
  const color = red ? '#DC2626' : '#1a1a1a'

  const cardStyle = fill
    ? { height: '100%', aspectRatio: '72/100', border: '2px solid #e5e7eb', padding: '8% 7%' }
    : { width: 72, height: 100, border: '1.5px solid #e5e7eb', padding: '4px 8px' }

  // In fill mode cards are ~42vw wide, so vw-based font sizes scale naturally
  const rankSize  = fill ? '4.5vw' : 14
  const suitSmall = fill ? '4vw'   : 12
  const suitBig   = fill ? '10vw'  : 28

  return (
    <motion.div
      initial={dealt ? { y: -60, opacity: 0, scale: 0.7 } : false}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl card-shadow flex flex-col items-center justify-between select-none no-select"
      style={cardStyle}
    >
      {/* Top-left rank + suit */}
      <div className="self-start leading-none" style={{ color, fontSize: rankSize, fontWeight: 700 }}>
        <div>{card.label}</div>
        <div style={{ fontSize: suitSmall }}>{card.suit}</div>
      </div>

      {/* Center suit */}
      <div style={{ color, fontSize: suitBig, lineHeight: 1 }}>{card.suit}</div>

      {/* Bottom-right rank + suit (rotated) */}
      <div
        className="self-end leading-none"
        style={{ color, fontSize: rankSize, fontWeight: 700, transform: 'rotate(180deg)' }}
      >
        <div>{card.label}</div>
        <div style={{ fontSize: suitSmall }}>{card.suit}</div>
      </div>
    </motion.div>
  )
}

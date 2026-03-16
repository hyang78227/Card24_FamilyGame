import { motion } from 'framer-motion'

export function PlayerButton({
  player,
  score,
  showScore,
  onPress,
  size = 'md',
  disabled = false,
  inactive = false,
}) {
  const sizes = {
    sm: { btn: 64, font: 11 },
    md: { btn: 80, font: 13 },
    lg: { btn: 96, font: 14 },
  }
  const { btn, font } = sizes[size] || sizes.md

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.92 }}
      onClick={onPress}
      disabled={disabled}
      className="flex flex-col items-center gap-1 no-select"
      style={{ opacity: inactive ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer' }}
    >
      {/* Photo / emoji circle */}
      <div
        style={{
          width: btn,
          height: btn,
          borderRadius: '50%',
          border: `3px solid ${player.themeColor}`,
          overflow: 'hidden',
          background: player.photo ? 'transparent' : `${player.themeColor}22`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: inactive ? 'grayscale(100%)' : 'none',
          boxShadow: `0 2px 8px ${player.themeColor}44`,
        }}
      >
        {player.photo ? (
          <img
            src={player.photo}
            alt={player.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: btn * 0.42 }}>{player.emoji}</span>
        )}
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: font,
          fontWeight: 700,
          color: player.themeColor,
          letterSpacing: 0.3,
        }}
      >
        {player.name}
      </span>

      {/* Score row — always reserve space, hide value when not peeking */}
      <span
        style={{
          fontSize: font,
          fontWeight: 800,
          color: player.accentColor,
          minHeight: 16,
          visibility: showScore ? 'visible' : 'hidden',
        }}
      >
        {score ?? 0} pts
      </span>
    </motion.button>
  )
}

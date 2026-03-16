import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SETTINGS_PIN } from '../data/players.js'

function PinScreen({ onUnlock }) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)

  function handleDigit(d) {
    const next = input + d
    if (next.length <= 4) {
      setInput(next)
      if (next.length === 4) {
        if (next === SETTINGS_PIN) {
          onUnlock()
        } else {
          setShake(true)
          setTimeout(() => { setShake(false); setInput('') }, 600)
        }
      }
    }
  }

  function handleDelete() {
    setInput(prev => prev.slice(0, -1))
  }

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-8">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-black text-2xl text-gray-700 mb-2">Settings</h2>
      <p className="text-gray-400 text-sm mb-8">Enter PIN to continue</p>

      {/* PIN dots */}
      <motion.div
        className="flex gap-4 mb-8"
        animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2"
            style={{
              borderColor: '#1E3A5F',
              background: i < input.length ? '#1E3A5F' : 'transparent',
            }}
          />
        ))}
      </motion.div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {digits.map((d, i) => (
          <button
            key={i}
            onClick={() => d === '⌫' ? handleDelete() : d ? handleDigit(d) : null}
            className="h-14 rounded-2xl font-bold text-xl"
            style={{
              background: d ? '#f3f4f6' : 'transparent',
              color: '#1E3A5F',
              visibility: d === '' ? 'hidden' : 'visible',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SettingsScreen({ players, settings, onUpdateSettings, onUpdatePhoto, onBack }) {
  const [unlocked, setUnlocked] = useState(false)
  const fileRefs = useRef({})

  if (!unlocked) {
    return <PinScreen onUnlock={() => setUnlocked(true)} />
  }

  function handlePhotoChange(playerId, e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onUpdatePhoto(playerId, ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ background: '#1E3A5F' }}>
        <button onClick={onBack} className="text-white text-xl">←</button>
        <h1 className="text-white font-black text-xl">Settings</h1>
      </div>

      <div className="flex flex-col gap-6 px-4 py-5">
        {/* Photo Upload */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Player Photos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {players.map(player => (
              <div
                key={player.id}
                className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl"
                style={{ background: `${player.themeColor}10`, border: `2px solid ${player.themeColor}40` }}
              >
                {/* Current photo / emoji */}
                <div
                  style={{
                    width: 64, height: 64, borderRadius: '50%',
                    border: `3px solid ${player.themeColor}`,
                    overflow: 'hidden',
                    background: `${player.themeColor}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {player.photo ? (
                    <img src={player.photo} alt={player.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 28 }}>{player.emoji}</span>
                  )}
                </div>
                <span className="font-bold text-sm" style={{ color: player.themeColor }}>
                  {player.name}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileRefs.current[player.id] = el}
                  onChange={e => handlePhotoChange(player.id, e)}
                  className="hidden"
                />
                <button
                  onClick={() => fileRefs.current[player.id]?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: player.themeColor }}
                >
                  {player.photo ? 'Change Photo' : 'Add Photo'}
                </button>
                {player.photo && (
                  <button
                    onClick={() => onUpdatePhoto(player.id, null)}
                    className="text-xs text-gray-400 underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Show Solution toggle */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: '#f8f9fa', border: '2px solid #e5e7eb' }}
        >
          <div>
            <p className="font-bold text-gray-700 text-sm">Show Solution</p>
            <p className="text-gray-400 text-xs">Reveal answer after no-solve rounds</p>
          </div>
          <button
            onClick={() => onUpdateSettings({ showSolution: !settings.showSolution })}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: settings.showSolution ? '#1E3A5F' : '#d1d5db' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: settings.showSolution ? 'translateX(24px)' : 'translateX(2px)' }}
            />
          </button>
        </div>

        {/* App version */}
        <div className="text-center text-gray-300 text-xs pb-4">
          Card 24 · v1.0 · Family Edition
        </div>
      </div>
    </div>
  )
}

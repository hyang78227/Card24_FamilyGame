import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayerButton } from './PlayerButton.jsx'

export function SetupScreen({ players, settings, onTogglePlayer, onUpdateSettings, onStart, onSettings }) {
  const activePlayers = players.filter(p => p.active)
  const canStart = activePlayers.length >= 2

  function toggleTimer() {
    onUpdateSettings({ timerOn: !settings.timerOn })
  }

  function adjustTimer(delta) {
    const current = settings.timerDuration || 60
    const next = Math.max(30, Math.min(120, current + delta * 30))
    onUpdateSettings({ timerDuration: next })
  }

  function toggleTeamMode() {
    onUpdateSettings({ teamMode: !settings.teamMode })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4"
        style={{ background: '#1E3A5F' }}
      >
        <div>
          <h1 className="text-white font-black text-2xl tracking-tight leading-none">Card 24</h1>
          <p className="text-blue-200 text-xs mt-0.5">Family Math Game</p>
        </div>
        <button
          onClick={onSettings}
          className="text-white text-xl p-2 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          ⚙️
        </button>
      </div>

      <div className="flex-1 flex flex-col px-4 py-5 gap-5">
        {/* Players section */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">
            Players — tap to toggle
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {players.map(player => (
              <div
                key={player.id}
                className="flex justify-center py-3 rounded-2xl"
                style={{
                  background: player.active ? `${player.themeColor}10` : '#f3f4f6',
                  border: `2px solid ${player.active ? player.themeColor : '#e5e7eb'}`,
                }}
              >
                <PlayerButton
                  player={player}
                  score={0}
                  showScore={false}
                  inactive={!player.active}
                  onPress={() => onTogglePlayer(player.id)}
                  size="md"
                />
              </div>
            ))}
          </div>
          {!canStart && (
            <p className="text-center text-red-500 text-sm mt-2">At least 2 players needed</p>
          )}
        </div>

        {/* Team Mode */}
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: '#f8f9fa', border: '2px solid #e5e7eb' }}
        >
          <div>
            <p className="font-bold text-gray-700 text-sm">Team Mode</p>
            <p className="text-gray-400 text-xs">Kids vs Parents</p>
          </div>
          <button
            onClick={toggleTeamMode}
            className="relative w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: settings.teamMode ? '#3B6D11' : '#d1d5db' }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: settings.teamMode ? 'translateX(24px)' : 'translateX(2px)' }}
            />
          </button>
        </div>

        {/* Timer section */}
        <div
          className="px-4 py-3 rounded-2xl"
          style={{ background: '#f8f9fa', border: '2px solid #e5e7eb' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-bold text-gray-700 text-sm">Timer</p>
              <p className="text-gray-400 text-xs">Optional countdown pressure</p>
            </div>
            <button
              onClick={toggleTimer}
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{ background: settings.timerOn ? '#1E3A5F' : '#d1d5db' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                style={{ transform: settings.timerOn ? 'translateX(24px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
          {settings.timerOn && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex items-center justify-center gap-4 pt-2"
            >
              <button
                onClick={() => adjustTimer(-1)}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-lg leading-none"
              >
                −
              </button>
              <span className="font-bold text-gray-700 text-lg w-16 text-center">
                {settings.timerDuration}s
              </span>
              <button
                onClick={() => adjustTimer(1)}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-lg leading-none"
              >
                +
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div className="px-4 pb-8">
        <motion.button
          whileTap={{ scale: canStart ? 0.96 : 1 }}
          onClick={canStart ? onStart : undefined}
          className="w-full py-4 rounded-2xl font-black text-xl tracking-wide text-white"
          style={{
            background: canStart
              ? 'linear-gradient(135deg, #1E3A5F 0%, #2d5491 100%)'
              : '#9ca3af',
            boxShadow: canStart ? '0 4px 20px rgba(30,58,95,0.4)' : 'none',
          }}
        >
          Start Game
        </motion.button>
      </div>
    </div>
  )
}

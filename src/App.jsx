import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SetupScreen } from './components/SetupScreen.jsx'
import { GameScreen } from './components/GameScreen.jsx'
import { CelebrationScreen } from './components/CelebrationScreen.jsx'
import { EndScreen } from './components/EndScreen.jsx'
import { SettingsScreen } from './components/SettingsScreen.jsx'
import { useGameState } from './hooks/useGameState.js'

const SCREENS = {
  SETUP: 'setup',
  GAME: 'game',
  END: 'end',
  SETTINGS: 'settings',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SETUP)
  const [prevScreen, setPrevScreen] = useState(null)
  const [celebrationPlayer, setCelebrationPlayer] = useState(null)

  const game = useGameState()

  function goTo(next) {
    setPrevScreen(screen)
    setScreen(next)
  }

  function handleStart() {
    game.startGame()
    goTo(SCREENS.GAME)
  }

  function handleAwardPoint(playerId) {
    const player = game.players.find(p => p.id === playerId)
    if (!player) return
    setCelebrationPlayer(player)
    game.awardPoint(playerId)
  }

  function handleCelebrationDone() {
    setCelebrationPlayer(null)
  }

  function handleStop() {
    goTo(SCREENS.END)
  }

  function handlePlayAgain() {
    goTo(SCREENS.SETUP)
  }

  function handleSuddenDeath() {
    game.startGame()
    goTo(SCREENS.GAME)
  }

  function handleOpenSettings() {
    goTo(SCREENS.SETTINGS)
  }

  function handleCloseSettings() {
    goTo(prevScreen || SCREENS.SETUP)
  }

  const slideVariants = {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  }
  const transition = { type: 'tween', duration: 0.25 }

  return (
    <div className="relative" style={{ minHeight: '100svh' }}>
      <AnimatePresence mode="wait">
        {screen === SCREENS.SETUP && (
          <motion.div key="setup" {...slideVariants} transition={transition} className="absolute inset-0">
            <SetupScreen
              players={game.players}
              settings={game.settings}
              onTogglePlayer={game.togglePlayerActive}
              onUpdateSettings={game.updateSettings}
              onStart={handleStart}
              onSettings={handleOpenSettings}
            />
          </motion.div>
        )}

        {screen === SCREENS.GAME && (
          <motion.div key="game" {...slideVariants} transition={transition} className="absolute inset-0">
            <div className="relative h-full">
              <GameScreen
                activePlayers={game.activePlayers}
                cards={game.cards}
                scores={game.scores}
                round={game.round}
                settings={game.settings}
                solution={game.solution}
                onAwardPoint={handleAwardPoint}
                onNextRound={game.nextRound}
                onStop={handleStop}
                getScore={game.getScore}
              />
              <AnimatePresence>
                {celebrationPlayer && (
                  <CelebrationScreen
                    key={`celeb-${game.round}`}
                    player={celebrationPlayer}
                    onDone={handleCelebrationDone}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {screen === SCREENS.END && (
          <motion.div key="end" {...slideVariants} transition={transition} className="absolute inset-0">
            <EndScreen
              activePlayers={game.activePlayers}
              getScore={game.getScore}
              round={game.round}
              isTie={game.isTie}
              onPlayAgain={handlePlayAgain}
              onSuddenDeath={handleSuddenDeath}
            />
          </motion.div>
        )}

        {screen === SCREENS.SETTINGS && (
          <motion.div key="settings" {...slideVariants} transition={transition} className="absolute inset-0">
            <SettingsScreen
              players={game.players}
              settings={game.settings}
              onUpdateSettings={game.updateSettings}
              onUpdatePhoto={game.updatePlayerPhoto}
              onBack={handleCloseSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

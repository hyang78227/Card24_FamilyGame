import { useState, useCallback } from 'react'
import { loadPlayers, savePlayers, loadSettings, saveSettings, resetActivePlayers } from '../utils/storage.js'
import { dealCards } from '../utils/cardUtils.js'
import { getSolution } from '../utils/solver24.js'

export function useGameState() {
  const [players, setPlayers] = useState(() => {
    const stored = loadPlayers()
    return resetActivePlayers(stored)
  })
  const [settings, setSettings] = useState(() => loadSettings())
  const [scores, setScores] = useState({})
  const [round, setRound] = useState(0)
  const [cards, setCards] = useState(() => dealCards())
  const [solution, setSolution] = useState(null)

  const activePlayers = players.filter(p => p.active)

  // Team mode helpers
  const getTeamForPlayer = useCallback((playerId) => {
    if (!settings.teamMode) return null
    const kidsIds = ['jayson', 'jiao']
    return kidsIds.includes(playerId) ? 'kids' : 'parents'
  }, [settings.teamMode])

  const getTeamScore = useCallback((teamName) => {
    const teamMap = { kids: ['jayson', 'jiao'], parents: ['hongling', 'jay'] }
    return (teamMap[teamName] || []).reduce((sum, id) => sum + (scores[id] || 0), 0)
  }, [scores])

  function togglePlayerActive(playerId) {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, active: !p.active } : p
    ))
  }

  function updatePlayerPhoto(playerId, photoBase64) {
    setPlayers(prev => {
      const updated = prev.map(p => p.id === playerId ? { ...p, photo: photoBase64 } : p)
      savePlayers(updated)
      return updated
    })
  }

  function updateSettings(newSettings) {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    saveSettings(merged)
  }

  function startGame() {
    setScores({})
    setRound(1)
    const newCards = dealCards()
    setCards(newCards)
    setSolution(settings.showSolution ? getSolution(newCards.map(c => c.value)) : null)
  }

  function awardPoint(playerId) {
    setScores(prev => ({ ...prev, [playerId]: (prev[playerId] || 0) + 1 }))
    nextRound()
  }

  function nextRound() {
    setRound(prev => prev + 1)
    const newCards = dealCards()
    setCards(newCards)
    setSolution(settings.showSolution ? getSolution(newCards.map(c => c.value)) : null)
  }

  function getScore(playerId) {
    if (settings.teamMode) {
      const team = getTeamForPlayer(playerId)
      return team ? getTeamScore(team) : (scores[playerId] || 0)
    }
    return scores[playerId] || 0
  }

  function getWinner() {
    const active = players.filter(p => p.active)
    if (active.length === 0) return null
    let best = active[0]
    for (const p of active) {
      if (getScore(p.id) > getScore(best.id)) best = p
    }
    return best
  }

  function isTie() {
    const active = players.filter(p => p.active)
    if (active.length < 2) return false
    const winner = getWinner()
    const winScore = getScore(winner.id)
    return active.filter(p => getScore(p.id) === winScore).length > 1
  }

  return {
    players,
    activePlayers,
    settings,
    scores,
    round,
    cards,
    solution,
    togglePlayerActive,
    updatePlayerPhoto,
    updateSettings,
    startGame,
    awardPoint,
    nextRound,
    getScore,
    getWinner,
    isTie,
  }
}

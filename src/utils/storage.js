import { DEFAULT_PLAYERS, DEFAULT_SETTINGS } from '../data/players.js'

const PLAYERS_KEY = 'card24_players'
const SETTINGS_KEY = 'card24_settings'

export function loadPlayers() {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY)
    if (!raw) return DEFAULT_PLAYERS.map(p => ({ ...p }))
    return JSON.parse(raw)
  } catch {
    return DEFAULT_PLAYERS.map(p => ({ ...p }))
  }
}

export function savePlayers(players) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

/** Reset all active states to true (called on each app launch) */
export function resetActivePlayers(players) {
  return players.map(p => ({ ...p, active: true }))
}

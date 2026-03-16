import { hasSolution } from './solver24.js'

export const SUITS = ['♥', '♦', '♠', '♣']
export const SUIT_NAMES = { '♥': 'hearts', '♦': 'diamonds', '♠': 'spades', '♣': 'clubs' }
export const RED_SUITS = ['♥', '♦']

const RANK_LABELS = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }

export function rankLabel(value) {
  return RANK_LABELS[value] || String(value)
}

export function isRedSuit(suit) {
  return RED_SUITS.includes(suit)
}

function randomCard() {
  const value = Math.floor(Math.random() * 13) + 1 // 1–13
  const suit = SUITS[Math.floor(Math.random() * 4)]
  return { value, suit, label: rankLabel(value) }
}

/**
 * Deal 4 cards that are guaranteed to have a 24 solution.
 * Retries until a solvable hand is found.
 */
export function dealCards() {
  let attempts = 0
  while (attempts < 1000) {
    const cards = [randomCard(), randomCard(), randomCard(), randomCard()]
    const values = cards.map(c => c.value)
    if (hasSolution(values)) return cards
    attempts++
  }
  // Fallback: known solvable hand
  return [
    { value: 3, suit: '♥', label: '3' },
    { value: 3, suit: '♦', label: '3' },
    { value: 8, suit: '♠', label: '8' },
    { value: 8, suit: '♣', label: '8' },
  ]
}

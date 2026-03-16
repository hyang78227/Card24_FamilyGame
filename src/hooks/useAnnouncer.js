import { useCallback } from 'react'

export function useAnnouncer() {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    // Cancel any in-progress speech
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.1
    utterance.pitch = 1.2
    utterance.volume = 1
    // Prefer an English voice if available
    const voices = window.speechSynthesis.getVoices()
    const eng = voices.find(v => v.lang.startsWith('en'))
    if (eng) utterance.voice = eng
    window.speechSynthesis.speak(utterance)
  }, [])

  const announcePoint = useCallback((playerName) => {
    speak(`Point goes to ${playerName}!`)
  }, [speak])

  const announceWinner = useCallback((playerName) => {
    speak(`${playerName} wins! Congratulations!`)
  }, [speak])

  const announceSuddenDeath = useCallback(() => {
    speak(`It\'s a tie! Sudden death round!`)
  }, [speak])

  return { speak, announcePoint, announceWinner, announceSuddenDeath }
}

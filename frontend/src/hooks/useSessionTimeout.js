import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const SESSION_LIMIT_MS = 60 * 60 * 1000 // 1 hour
const WARNING_WINDOW_MS = 5 * 60 * 1000 // 5 minutes left to react

/**
 * After 1 hour of being logged in, shows a "still there?" popup.
 * If the user doesn't click "Continue" within 5 minutes, they are
 * automatically logged out.
 */
export function useSessionTimeout() {
  const { isLoggedIn, logout } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(WARNING_WINDOW_MS / 1000)

  const warningTimerRef = useRef(null)
  const logoutTimerRef = useRef(null)
  const countdownRef = useRef(null)

  const clearAllTimers = () => {
    clearTimeout(warningTimerRef.current)
    clearTimeout(logoutTimerRef.current)
    clearInterval(countdownRef.current)
  }

  const startTimers = () => {
    clearAllTimers()
    const loginTime = Number(localStorage.getItem('lms_login_time')) || Date.now()
    const elapsed = Date.now() - loginTime
    const untilWarning = Math.max(SESSION_LIMIT_MS - elapsed, 0)

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      setSecondsLeft(WARNING_WINDOW_MS / 1000)

      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      logoutTimerRef.current = setTimeout(() => {
        clearInterval(countdownRef.current)
        setShowWarning(false)
        logout()
        window.location.href = '/login'
      }, WARNING_WINDOW_MS)
    }, untilWarning)
  }

  const continueSession = () => {
    setShowWarning(false)
    clearAllTimers()
    localStorage.setItem('lms_login_time', Date.now().toString())
    startTimers()
  }

  useEffect(() => {
    if (isLoggedIn) {
      startTimers()
    } else {
      clearAllTimers()
      setShowWarning(false)
    }
    return clearAllTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  return { showWarning, secondsLeft, continueSession }
}

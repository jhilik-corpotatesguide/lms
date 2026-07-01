import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lms_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('lms_token'))

  useEffect(() => {
    if (token) localStorage.setItem('lms_token', token)
    else localStorage.removeItem('lms_token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('lms_user', JSON.stringify(user))
    else localStorage.removeItem('lms_user')
  }, [user])

  const login = (accessToken, userData) => {
    setToken(accessToken)
    setUser(userData)
    // Record login time so the session-timeout hook can calculate
    // when the 1 hour mark will be reached.
    localStorage.setItem('lms_login_time', Date.now().toString())
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('lms_login_time')
  }

  const isLoggedIn = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, setUser, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

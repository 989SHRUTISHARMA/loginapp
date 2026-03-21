import { createContext, useContext, useState, useEffect } from 'react'

// ─── Create Context ───────────────────────────────────────────
// Think of Context like a "global store" for React.
// Instead of passing user data down through every component via props,
// any component in the tree can just call useAuth() to access it.
const AuthContext = createContext(null)

// ─── AuthProvider ─────────────────────────────────────────────
// Wrap your whole app in this so every page can access auth state.
// It manages: current user data, login, logout, and token persistence.
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage so login persists on page refresh
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mernUser')
    return stored ? JSON.parse(stored) : null
  })

  const [loading, setLoading] = useState(false)

  // ── Login ──────────────────────────────────────────────────
  // Store user in state AND localStorage so it survives page refresh
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('mernUser', JSON.stringify(userData))
  }

  // ── Logout ─────────────────────────────────────────────────
  // Clear everything — state and localStorage
  const logout = () => {
    setUser(null)
    localStorage.removeItem('mernUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Custom Hook ──────────────────────────────────────────────
// Shortcut: instead of `useContext(AuthContext)` in every file,
// just import and call `useAuth()`
export const useAuth = () => useContext(AuthContext)

import { createContext, useState, useEffect, useCallback } from 'react'
import { loginApi, registerApi } from '../api/authApi'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Rehydrate from localStorage on mount ──────
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // ── Login ─────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials)
    const data = res.data.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    toast.success(`Welcome back, ${data.name}!`)
    return data
  }, [])

  // ── Register ──────────────────────────────────
  const register = useCallback(async (payload) => {
    const res = await registerApi(payload)
    const data = res.data.data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data))
    setToken(data.token)
    setUser(data)
    toast.success('Account created successfully!')
    return data
  }, [])

  // ── Logout ────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.clear()
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  // ── Update user in context (after profile edit) ─
  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData }
    localStorage.setItem('user', JSON.stringify(merged))
    setUser(merged)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sb_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('sb_token'))
        .finally(() => setLoading(false))
    } else setLoading(false)
  }, [])

  async function login(email, password) {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('sb_token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  async function register(form) {
    const { data } = await axios.post('/api/auth/register', form)
    localStorage.setItem('sb_token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('sb_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  async function refreshUser() {
    try {
      const r = await axios.get('/api/auth/me')
      setUser(r.data)
    } catch (_) {}
  }

  return <Ctx.Provider value={{ user, loading, login, register, logout, refreshUser }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

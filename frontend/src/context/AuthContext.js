import React, { useState, createContext, useContext, useEffect } from 'react'

const AuthContext = createContext(null) // default null is best practice

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem('token')
    const role = sessionStorage.getItem('role')
    return token && role ? { token, role } : null
  })
  const [loading, setLoading] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const refreshCartCount = async () => {
    if (!user?.token) {
      setCartCount(0)
      return
    }
    try {
      const res = await fetch('http://localhost:3000/api/cart', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setCartCount(data.reduce((sum, item) => sum + item.quantity, 0))
      }
    } catch (err) {
      console.error('Cart refresh failed', err)
    }
  }


  // 💓 Heartbeat to check for suspension AND fetch user profile
  useEffect(() => {
    if (!user?.token) return

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${user.token}` }
        })

        if (res.ok) {
          const userData = await res.json()
          setUser(prev => ({ ...prev, ...userData }))
        } else if (res.status === 403) {
          const data = await res.json()
          if (data.message === 'Account Suspended') {
            alert(`You have been suspended for 24 hours.\n\nReason: Admin Action\nUntil: ${data.details.split('until ')[1] || 'Tomorrow'}`)
            logout()
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          logout()
        }
      } catch (err) {
        console.error('Profile fetch failed', err)
      }
    }

    fetchProfile()
    refreshCartCount()
    const interval = setInterval(() => {
      fetchProfile()
      refreshCartCount()
    }, 10000)
    return () => clearInterval(interval)

  }, [user?.token])

  // Call this after backend login or profile update
  const login = (token, role, userData = {}) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('role', role)
    setUser(prev => ({ ...prev, token, role, ...userData }))
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    setUser(null)
  }

  const isLoggedIn = !!user
  const userRole = user?.role

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isLoggedIn,
        login,
        logout,
        loading,
        cartCount,
        refreshCartCount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

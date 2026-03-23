import React from 'react'
import { useLocation } from 'react-router-dom'
import { AdminNavbar } from './AdminNavBar'
import { useAuth } from '../context/AuthContext'

export function AdminNavbarWrapper() {
  const { userRole, isLoggedIn, loading } = useAuth()
  const location = useLocation()
  const path = location.pathname

  if (loading) return null

  // Only show sidebar on /admin routes for admins
  const isAdminRoute = path.startsWith('/admin')
  const isAuthRoute = path === '/admin/login'

  if (isAdminRoute && !isAuthRoute && isLoggedIn && userRole === 'admin') {
    return <AdminNavbar />
  }

  return null
}

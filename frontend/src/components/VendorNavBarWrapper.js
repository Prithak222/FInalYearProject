import React from 'react'
import { useLocation } from 'react-router-dom'
import { VendorNavbar } from './VendorNavBar'
import { useAuth } from '../context/AuthContext'

export function VendorNavbarWrapper() {
  const { isLoggedIn, userRole, loading } = useAuth()
  const location = useLocation()
  const path = location.pathname

  if (loading) return null

  // Only show sidebar on /vendor routes for vendors, but NOT on login/register
  const isVendorRoute = path.startsWith('/vendor')
  const isAuthRoute = path === '/vendor/login' || path === '/vendor/register'

  if (isVendorRoute && !isAuthRoute && isLoggedIn && userRole === 'vendor') {
    return <VendorNavbar />
  }

  return null
}

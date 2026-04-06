import { useLocation } from 'react-router-dom'
import { Footer } from './Footer'

export function FooterWrapper() {
  const location = useLocation()
  const path = location.pathname

  const hideFooterPaths = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/vendor/forgot-password', 
    '/vendor/login', 
    '/vendor/register'
  ]

  // Hide on auth paths OR when in vendor/admin portals
  if (
    hideFooterPaths.includes(path) ||
    path.startsWith('/vendor') ||
    path.startsWith('/admin') ||
    path === '/messages' // Hide on messages for better chat UI
  ) {
    return null
  }

  return <Footer />
}

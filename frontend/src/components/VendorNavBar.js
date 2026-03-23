import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  DollarSignIcon,
  MessageSquareIcon,
  LogOutIcon,
  XIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function VendorNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    {
      path: '/vendor/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      path: '/vendor/products',
      label: 'Products',
      icon: PackageIcon,
    },
    {
      path: '/vendor/orders',
      label: 'Orders',
      icon: ShoppingBagIcon,
    },
    {
      path: '/vendor/chat',
      label: 'Customer Chat',
      icon: MessageSquareIcon,
    },
    {
      path: '/vendor/earnings',
      label: 'Earnings',
      icon: DollarSignIcon,
    },
    {
      path: '/vendor/verification',
      label: 'Verification',
      icon: ShieldCheckIcon,
    },
    {
      path: '/vendor/profile',
      label: 'Settings',
      icon: SettingsIcon,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-white border-r border-border overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-5 border-b border-border">
            <Link
              to="/vendor/dashboard"
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground block">
                  DosroDeal
                </span>
                <span className="text-xs font-semibold text-primary">
                  Vendor Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="flex-shrink-0 border-t border-border p-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <XIcon className="w-5 h-5" />
              <span>Exit Vendor</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboardIcon,
  UsersIcon,
  StoreIcon,
  PackageIcon,
  FlagIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BanknoteIcon,
  LogOutIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function AdminNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  // ✅ JS version (removed ": string")
  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
    { path: '/admin/vendors', label: 'Vendors', icon: StoreIcon },
    { path: '/admin/listings', label: 'Listings', icon: PackageIcon },
    { path: '/admin/reports', label: 'Reports', icon: FlagIcon },
    { path: '/admin/verification', label: 'Verification', icon: ShieldCheckIcon },
    { path: '/admin/payments', label: 'Payments', icon: CreditCardIcon },
    { path: '/admin/payouts', label: 'Payouts', icon: BanknoteIcon },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
        <div className="flex flex-col flex-grow bg-white border-r overflow-y-auto">
          <div className="flex items-center px-6 py-5 border-b">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <span className="text-lg font-bold block">DosroDeal</span>
                <span className="text-xs font-semibold text-red-600">
                  Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t p-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <LogOutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center ${
                  isActive(link.path)
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

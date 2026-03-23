import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  GridIcon,
  MessageSquareIcon,
  HeartIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  StoreIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CreditCardIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userRole, isLoggedIn, logout, user, cartCount } = useAuth()

  const [showVendorMenu, setShowVendorMenu] = useState(false)

  const isActive = (path) => location.pathname === path


  const navLinks = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/categories', label: 'Categories', icon: GridIcon },
    { path: '/wishlist', label: 'Wishlist', icon: HeartIcon },
  ]

  const handleLogout = () => {
    logout()
    sessionStorage.removeItem('token') // Use sessionStorage as in other components
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">DosroDeal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Section: Auth/Profile (Unified for Mobile & Desktop) */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon for Desktop */}
            {isLoggedIn && (
              <Link
                to="/cart"
                className="relative p-2 text-muted-foreground hover:text-primary transition-colors hidden md:block"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  Register
                </Link>

                {/* Vendor Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowVendorMenu(!showVendorMenu)}
                    className="flex items-center space-x-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <StoreIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Vendor</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {showVendorMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowVendorMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-border shadow-lg py-1 z-20 animate-in fade-in zoom-in duration-200">
                        <Link
                          to="/vendor/login"
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowVendorMenu(false)}
                        >
                          Vendor Login
                        </Link>
                        <Link
                          to="/vendor/register"
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowVendorMenu(false)}
                        >
                          Vendor Register
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {userRole === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 hidden sm:block shadow-sm"
                  >
                    Vendor Dashboard
                  </Link>
                )}

                {/* Profile Dropdown (The only access point) */}
                <div className="relative">
                  <button
                    onClick={() => setShowVendorMenu(!showVendorMenu)}
                    className="flex items-center space-x-2 focus:outline-none transition-transform active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shadow-sm">
                      {user?.image ? (
                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-sm">
                          {(user?.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </button>

                  {showVendorMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowVendorMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-border shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                        {/* Header */}
                        <div className="px-4 py-4 border-b border-border bg-slate-50/50">
                          <p className="text-sm font-bold text-foreground">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1">
                          <ProfileDropDownItem
                            to="/profile"
                            icon={<UserIcon className="w-4 h-4" />}
                            label="View Full Profile"
                            onClick={() => setShowVendorMenu(false)}
                          />
                          <ProfileDropDownItem
                            to="/my-orders"
                            icon={<ShoppingBagIcon className="w-4 h-4" />}
                            label="My Orders"
                            onClick={() => setShowVendorMenu(false)}
                          />
                          <ProfileDropDownItem
                            to="/wishlist"
                            icon={<HeartIcon className="w-4 h-4" />}
                            label="My Wishlist"
                            onClick={() => setShowVendorMenu(false)}
                          />
                          <ProfileDropDownItem
                            to="/cart"
                            icon={<ShoppingCartIcon className="w-4 h-4" />}
                            label="My Cart"
                            onClick={() => setShowVendorMenu(false)}
                          />
                          <ProfileDropDownItem
                            to="/payment-history"
                            icon={<CreditCardIcon className="w-4 h-4" />}
                            label="Payment History"
                            onClick={() => setShowVendorMenu(false)}
                          />
                          <ProfileDropDownItem
                            to="/messages"
                            icon={<MessageSquareIcon className="w-4 h-4" />}
                            label="Messages"
                            onClick={() => setShowVendorMenu(false)}
                          />
                        </div>

                        {/* Logout */}
                        <div className="p-1 border-t border-border bg-slate-50/30">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOutIcon className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
          {isLoggedIn && (
            <Link
              to="/cart"
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 relative ${isActive('/cart') ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-2 right-1/4 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav >
  )
}

function ProfileDropDownItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors"
    >
      <span className="text-muted-foreground/70">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

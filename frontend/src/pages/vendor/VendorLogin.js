import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  StoreIcon,
  ArrowLeftIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function VendorLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/vendor/dashboard'
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(
        'http://localhost:3000/auth/vendor/login',
        formData
      )

      // save token + role in AuthContext + sessionStorage
      const { token, userType: role } = res.data
      login(token, role || 'vendor')

      // navigate back to the page they were trying to visit, or default to vendor dashboard
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Vendor login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative">
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-foreground"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <StoreIcon className="w-5 h-5 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Vendor Login
          </h1>
          <p className="text-muted-foreground">Access your vendor dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg focus:ring-2 focus:ring-ring"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>

              <Link
                to="/vendor/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In to Vendor Portal'}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have a vendor account?{' '}
                <Link
                  to="/vendor/register"
                  className="text-primary font-medium hover:underline"
                >
                  Register as vendor
                </Link>
              </p>
            </div>

            <div className="text-center pt-4 border-t border-border">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to customer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

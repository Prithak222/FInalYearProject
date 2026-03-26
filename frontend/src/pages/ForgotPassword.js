import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckCircleIcon, ShieldCheckIcon } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export function ForgotPassword() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [step, setStep] = useState(1) // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  })

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Error sending OTP', 'error')
        return
      }

      showToast('OTP sent to your email!', 'success')
      setStep(2)
    } catch (error) {
      console.error(error)
      showToast('Cannot connect to server', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Error resetting password', 'error')
        return
      }

      showToast('Password reset successfully!', 'success')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error(error)
      showToast('Cannot connect to server', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <span className="text-2xl font-bold text-foreground">DosroDeal</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 ? 'Forgot password?' : 'Reset your password'}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 
              ? "No worries, we'll send you reset instructions." 
              : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Verification Code (OTP)</label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring tracking-[0.5em] font-mono text-center text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-muted-foreground hover:text-foreground mt-2"
              >
                Use a different email
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary hover:underline font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  Edit2Icon,
  SaveIcon,
  XIcon,
  CameraIcon,
  AlertCircleIcon,
  MessageSquareIcon,
  SendIcon
} from 'lucide-react'

export function Profile() {
  const { user, login } = useAuth()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [orderCount, setOrderCount] = useState(null)
  const [wishlistCount, setWishlistCount] = useState(null)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    image: user?.image || ''
  })

  // Report Problem State
  const [reportData, setReportData] = useState({ subject: '', description: '' })
  const [reportLoading, setReportLoading] = useState(false)
  const [reportMessage, setReportMessage] = useState({ type: '', text: '' })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse text-lg font-medium">Loading profile...</p>
      </div>
    )
  }
  
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = user?.token || sessionStorage.getItem('token')
        
        // Fetch Order Count
        const orderRes = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (orderRes.ok) {
          const orders = await orderRes.json()
          setOrderCount(orders.length)
        }

        // Fetch Wishlist Count
        const wishlistRes = await fetch('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (wishlistRes.ok) {
          const items = await wishlistRes.json()
          setWishlistCount(items.length)
        }
      } catch (err) {
        console.error("Error fetching profile stats:", err)
      }
    }

    if (user?.token) {
        fetchStats()
    }
  }, [user?.token])

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {

    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Account status logic
  const getAccountStatus = () => {
    if (user.role === 'vendor') {
      return user.isVendorApproved ? 'Verified Vendor' : 'Pending Approval'
    }
    return 'Active'
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' })
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('http://localhost:5000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        // Update context with new user data immediately
        login(user.token, user.role, data.user)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    if (!reportData.subject || !reportData.description) {
        setReportMessage({ type: 'error', text: 'Please fill in all fields' })
        return
    }

    setReportLoading(true)
    setReportMessage({ type: '', text: '' })
    try {
        const res = await fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
            body: JSON.stringify(reportData)
        })

        const data = await res.json()
        if (res.ok) {
            setReportMessage({ type: 'success', text: 'Problem reported successfully! Admin will review it.' })
            setReportData({ subject: '', description: '' })
        } else {
            setReportMessage({ type: 'error', text: data.message || 'Failed to submit report' })
        }
    } catch (err) {
        setReportMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
        setReportLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-24">
      {/* Hero Banner */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-primary/10" />

      <div className="max-w-4xl mx-auto px-4 -mt-20">
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">

          {/* Alert Message */}
          {message.text && (
            <div className={`p-4 text-center text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Header Section */}
          <div className="p-6 md:p-10 border-b border-border bg-white">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-primary/5 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  {isEditing ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full relative cursor-pointer group/upload"
                    >
                      <img src={formData.image || user.image || 'https://via.placeholder.com/150'} alt="Preview" className="w-full h-full object-cover group-hover/upload:opacity-50 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover/upload:opacity-100 transition-opacity">
                        <CameraIcon className="w-8 h-8 text-white mb-2" />
                        <span className="text-[10px] bg-black/60 text-white font-bold px-2 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-xl">
                          Select Photo
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  ) : user.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 md:mt-2 text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 w-full text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-3xl md:text-4xl font-black text-foreground tracking-tight bg-slate-50 border border-primary/20 rounded-xl px-4 py-1.5 w-full focus:outline-none focus:ring-2 ring-primary/20 transition-all font-sans"
                        placeholder="Your Full Name"
                      />
                    ) : (
                      <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">{user.name}</h1>
                    )}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                        {user.role || 'Customer'}
                      </span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {getAccountStatus()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                          <SaveIcon className="w-4 h-4" />
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                        <button
                          onClick={() => { setIsEditing(false); setMessage({ type: '', text: '' }) }}
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-200"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-200 transition-all active:scale-95"
                      >
                        <Edit2Icon className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <Link to="/my-orders" className="block w-full">
                    <StatCard icon={<ShoppingBagIcon className="w-4 h-4 text-indigo-500" />} label="Orders" value={orderCount !== null ? orderCount : '...'} />
                  </Link>
                  <StatCard icon={<HeartIcon className="w-4 h-4 text-rose-500" />} label="Wishlist" value={wishlistCount !== null ? wishlistCount : '...'} />
                  <StatCard icon={<ShieldCheckIcon className="w-4 h-4 text-emerald-500" />} label="Status" value={user.role === 'vendor' ? (user.verificationStatus || 'Verified') : 'Active'} />
                  <StatCard icon={<CalendarIcon className="w-4 h-4 text-amber-500" />} label="Year" value={new Date(user.createdAt).getFullYear()} />
                </div>

              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

              {/* Personal Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <span className="w-8 h-px bg-slate-200 mr-3"></span>
                    Identity Details
                  </h3>
                  <div className="space-y-6">
                    <DetailItem icon={<UserIcon />} label="Display Name" value={isEditing ? (
                      <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary" />
                    ) : user.name} />
                    <DetailItem icon={<MailIcon />} label="Email Address" value={user.email} />
                    <DetailItem icon={<PhoneIcon />} label="Phone Number" value={isEditing ? (
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+977..." className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary" />
                    ) : user.phone || 'Not provided'} />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <span className="w-8 h-px bg-slate-200 mr-3"></span>
                    Account Logistics
                  </h3>
                  <div className="space-y-6">
                    <DetailItem icon={<MapPinIcon />} label="Shipping Address" value={isEditing ? (
                      <textarea name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary min-h-[80px]" />
                    ) : user.address || 'No address saved'} />
                    <DetailItem icon={<ShieldCheckIcon />} label="Account Role" value={user.role?.toUpperCase() || 'CUSTOMER'} />
                    <DetailItem icon={<CalendarIcon />} label="Member Since" value={joinDate} />
                  </div>
                </div>
              </div>

            </div>

            {/* Report a Problem Section */}
            <div className="mt-16 pt-10 border-t border-slate-100">
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/3">
                        <div className="p-3 bg-red-50 rounded-2xl text-red-600 w-12 h-12 flex items-center justify-center mb-4">
                            <AlertCircleIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Report a Problem</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Facing any issues with an order, a vendor, or the platform? Let our admin team know, and we'll resolve it as soon as possible.
                        </p>
                    </div>

                    <div className="flex-1">
                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
                            {reportMessage.text && (
                                <div className={`p-4 rounded-xl text-xs font-bold mb-6 text-center shadow-sm ${reportMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                    {reportMessage.text}
                                </div>
                            )}
                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Broken item received / Payment issue" 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-red-500/10 font-medium"
                                        value={reportData.subject}
                                        onChange={(e) => setReportData({...reportData, subject: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Description</label>
                                    <textarea 
                                        rows="4"
                                        placeholder="Please provide as much detail as possible..." 
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-red-500/10 font-medium resize-none text-slate-600 leading-relaxed"
                                        value={reportData.description}
                                        onChange={(e) => setReportData({...reportData, description: e.target.value})}
                                    />
                                </div>
                                <button 
                                    onClick={handleReportSubmit}
                                    disabled={reportLoading}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50 mt-2 flex items-center justify-center gap-3 shadow-lg"
                                >
                                    {reportLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <SendIcon className="w-4 h-4" />
                                            Submit Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50/50 px-6 py-4 border-t border-border">
            <p className="text-center text-xs text-muted-foreground font-medium italic">
              {isEditing ? 'Make sure your details are accurate before saving.' : 'This information is currently read-only. Click edit to update your personal details.'}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-border/50 rounded-2xl p-3 text-center hover:bg-accent transition-colors cursor-default">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
    </div>
  )
}

function DetailItem({ icon, label, value, badge }) {
  return (
    <div className="flex items-start">
      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-border flex items-center justify-center text-muted-foreground mt-0.5">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <div className="ml-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`font-semibold ${badge ? 'px-2 py-0.5 bg-primary/10 text-primary rounded-md text-sm inline-block' : 'text-foreground'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {
  StoreIcon,
  UploadIcon,
  SaveIcon,
  LockIcon,
  CreditCardIcon,
  BellIcon,
  TruckIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  PackageIcon,
  AlertTriangleIcon,
  ImageIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Toggle Component
const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 rounded-full transition ${
      enabled ? 'bg-primary' : 'bg-gray-200'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
)

export function VendorProfile() {
  const { user, isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    category: '',
    businessHours: '',
    returnPolicy: '',
    shopSlug: '',
    shopLogo: '',
    shopBanner: '',

    name: '',
    email: '',
    phone: '',
    address: '',
    image: '',

    bankName: '',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
    payoutSchedule: 'weekly',
    payoutThreshold: '50',

    notifNewOrderEmail: true,
    notifNewOrderPush: true,

    domesticShipping: true,
    internationalShipping: false,
  })

  // API Configuration
  const AUTH_BASE = 'http://localhost:3000/auth'

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only initialize when we have the actual user profile data (not just token/role)
    if (!isLoggedIn || !user || !user.email || isInitialized) return

    console.log('Initializing VendorProfile with loaded user data:', user);
    
    setFormData(prev => ({
      ...prev,
      ...user,
      name: user.name || '',
      email: user.email || '',
    }))
    setLoading(false)
    setIsInitialized(true)
  }, [user, isLoggedIn, isInitialized])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleToggle = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const token = sessionStorage.getItem('token')

    console.log('Submitting profile update:', formData);

    try {
      const res = await fetch(`${AUTH_BASE}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        alert('Profile updated successfully!')
        // Optional: you could call a sync method here if AuthContext provided one
      } else {
        alert(data.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Update error', err)
      alert('An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading Settings...</div>
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Settings</h1>
            <p className="text-slate-500 mt-1">Manage your shop identity and account preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: 'Shop Profile', icon: StoreIcon },
            { id: 'account', label: 'Personal Info', icon: UserIcon },
            { id: 'payments', label: 'Payments', icon: CreditCardIcon },
            { id: 'notifications', label: 'Notifications', icon: BellIcon },
            { id: 'shipping', label: 'Shipping', icon: TruckIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Shop Name</label>
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        placeholder="e.g. Vintage Treasures"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Shop Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home & Garden</option>
                        <option value="Collectibles">Collectibles</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Management */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 block">Shop Logo</label>
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {formData.shopLogo ? (
                            <img src={formData.shopLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                          ) : (
                            <StoreIcon className="text-slate-300" size={32} />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            name="shopLogo"
                            value={formData.shopLogo}
                            onChange={handleChange}
                            placeholder="Logo URL (e.g. https://...)"
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                          <p className="text-[10px] text-slate-400">Paste an image URL above or use a hosting service like Cloudinary.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700 block">Shop Banner</label>
                      <div className="space-y-2">
                        <div className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                          {formData.shopBanner ? (
                            <img src={formData.shopBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-slate-300" size={32} />
                          )}
                        </div>
                        <input
                          type="text"
                          name="shopBanner"
                          value={formData.shopBanner}
                          onChange={handleChange}
                          placeholder="Banner URL (e.g. https://...)"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Shop Description</label>
                    <textarea
                      name="shopDescription"
                      value={formData.shopDescription}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell customers about your shop..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Business Hours</label>
                      <input
                        type="text"
                        name="businessHours"
                        value={formData.businessHours}
                        onChange={handleChange}
                        placeholder="e.g. 9 AM - 6 PM"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Return Policy</label>
                      <input
                        type="text"
                        name="returnPolicy"
                        value={formData.returnPolicy}
                        onChange={handleChange}
                        placeholder="e.g. 7-day returns"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Owner Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Business Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Account Holder</label>
                      <input
                        type="text"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Payout Schedule</label>
                      <select
                        name="payoutSchedule"
                        value={formData.payoutSchedule}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <MailIcon className="text-slate-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Email Notifications</p>
                        <p className="text-xs text-slate-500">Receive order updates via email</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={formData.notifNewOrderEmail}
                      onChange={() => handleToggle('notifNewOrderEmail')}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <BellIcon className="text-slate-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Push Notifications</p>
                        <p className="text-xs text-slate-500">Receive real-time alerts</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={formData.notifNewOrderPush}
                      onChange={() => handleToggle('notifNewOrderPush')}
                    />
                  </div>
                </div>
              )}

              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <MapPinIcon className="text-slate-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Domestic Shipping</p>
                        <p className="text-xs text-slate-500">Enable shipping within the country</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={formData.domesticShipping}
                      onChange={() => handleToggle('domesticShipping')}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <GlobeIcon className="text-slate-600" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">International Shipping</p>
                        <p className="text-xs text-slate-500">Enable worldwide delivery</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={formData.internationalShipping}
                      onChange={() => handleToggle('internationalShipping')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 ${
                  saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800'
                }`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <SaveIcon size={18} />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
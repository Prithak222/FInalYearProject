import React, { useState, useEffect, useRef } from 'react'
import { 
  ShieldCheckIcon, 
  UploadIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  CheckCircleIcon,
  InfoIcon,
  CreditCardIcon,
  FileTextIcon,
  CameraIcon,
  XIcon
} from 'lucide-react'

export default function VendorVerification() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    citizenshipFront: '',
    citizenshipBack: '',
    businessLicense: ''
  })

  const citizenshipFrontRef = useRef(null)
  const citizenshipBackRef = useRef(null)
  const businessLicenseRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data)
        setFormData({
          citizenshipFront: data.verificationDocs?.citizenshipFront || '',
          citizenshipBack: data.verificationDocs?.citizenshipBack || '',
          businessLicense: data.verificationDocs?.businessLicense || ''
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [field]: reader.result
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.citizenshipFront || !formData.citizenshipBack || !formData.businessLicense) {
      alert('Please upload all required documents')
      return
    }

    setSubmitting(true)
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch('http://localhost:5000/auth/vendor/submit-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        alert('Verification request submitted!')
        setUser(data.user)
      } else {
        alert(data.message || 'Submission failed')
      }
    } catch (err) {
      alert('Error submitting verification')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 md:ml-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const status = user?.verificationStatus || 'Not Submitted'

  const UploadBox = ({ label, field, inputRef, icon: Icon }) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => handleFileChange(e, field)}
        accept="image/*"
        className="hidden"
      />
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${
          formData[field] 
            ? 'border-indigo-200 bg-gray-50' 
            : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30'
        }`}
      >
        {formData[field] ? (
          <>
            <img src={formData[field]} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <div className="bg-white/90 backdrop-blur p-2 rounded-full text-indigo-600 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                <CameraIcon size={20} />
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setFormData(prev => ({ ...prev, [field]: '' }))
              }}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
            >
              <XIcon size={14} />
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-indigo-600">
              <Icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Click to Upload</span>
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 md:ml-64">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Vendor Verification</h1>
          <p className="text-gray-500 font-medium tracking-tight">Verify your identity to increase trust and unlock all features</p>
        </div>

        {/* Status Card */}
        <div className={`mb-10 rounded-3xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
          status === 'Verified' ? 'bg-emerald-50 border-emerald-100' :
          status === 'Pending' ? 'bg-amber-50 border-amber-100' :
          status === 'Rejected' ? 'bg-red-50 border-red-100' :
          'bg-indigo-50 border-indigo-100'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-3 ${
              status === 'Verified' ? 'bg-emerald-100 text-emerald-600' :
              status === 'Pending' ? 'bg-amber-100 text-amber-600' :
              status === 'Rejected' ? 'bg-red-100 text-red-600' :
              'bg-indigo-100 text-indigo-600'
            }`}>
              {status === 'Verified' ? <ShieldCheckIcon size={32} /> :
               status === 'Pending' ? <ClockIcon size={32} /> :
               status === 'Rejected' ? <AlertCircleIcon size={32} /> :
               <ShieldCheckIcon size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-none mb-2">{status}</h3>
              <p className="text-sm text-gray-600 font-medium max-w-md">
                {status === 'Verified' ? 'Your account is fully verified. You have full access to all features.' :
                 status === 'Pending' ? 'Our team is currently reviewing your documents. This usually takes 24-48 hours.' :
                 status === 'Rejected' ? `Verification was rejected: ${user?.rejectionReason || 'Please check your documents.'}` :
                 'Submit your documents to start the verification process and build customer trust.'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 text-sm">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-premium group hover:border-indigo-100 transition-all">
            <h4 className="font-black mb-4 flex items-center gap-2 text-indigo-600 uppercase tracking-widest text-[10px]">
              <InfoIcon size={16} /> Why verify?
            </h4>
            <ul className="space-y-3 text-gray-500 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircleIcon size={14} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                Build trust with customers through a verified badge
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon size={14} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                Unlock higher selling limits and faster payouts
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon size={14} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                Priority support and platform protection
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-premium group hover:border-indigo-100 transition-all">
            <h4 className="font-black mb-4 flex items-center gap-2 text-indigo-600 uppercase tracking-widest text-[10px]">
              <FileTextIcon size={16} /> Requirements
            </h4>
            <ul className="space-y-3 text-gray-500 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                Valid Government Issued ID
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                Clear photos (Front & Back)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                PAN Card or Business License
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                Readable and non-expired doc
              </li>
            </ul>
          </div>
        </div>

        {/* Verification Form */}
        {(status === 'Not Submitted' || status === 'Rejected') && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-gray-50">
              <h2 className="text-2xl font-black text-gray-900 leading-none">Document Submission</h2>
              <p className="text-sm text-gray-400 font-medium mt-2">Please upload clear photos of your official documents</p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <UploadBox 
                  label="Citizenship Front Image" 
                  field="citizenshipFront" 
                  inputRef={citizenshipFrontRef} 
                  icon={CreditCardIcon} 
                />
                <UploadBox 
                  label="Citizenship Back Image" 
                  field="citizenshipBack" 
                  inputRef={citizenshipBackRef} 
                  icon={CreditCardIcon} 
                />
              </div>

              <UploadBox 
                label="PAN / Business License Image" 
                field="businessLicense" 
                inputRef={businessLicenseRef} 
                icon={FileTextIcon} 
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-black text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadIcon size={18} />
                  )}
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View Documents (If Pending or Verified) */}
        {(status === 'Pending' || status === 'Verified') && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-premium p-10">
            <h3 className="text-xl font-black text-gray-900 leading-none mb-8">Submitted Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries({
                'Citizenship Front': formData.citizenshipFront,
                'Citizenship Back': formData.citizenshipBack,
                'Business License': formData.businessLicense
              }).map(([label, url]) => (
                <div key={label} className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">{label}</p>
                  <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group relative shadow-sm">
                    <img src={url} alt={label} className="w-full h-full object-cover" />
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-[2px]"
                    >
                      View Original
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

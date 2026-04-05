import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ImageIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Store,
  Tag,
  MapPin,
  Smartphone,
  Armchair,
  Shirt,
  Book,
  Bike,
  Home as HomeIcon,
  Gamepad2,
  Package,
  Info,
  Sparkles,
  DollarSign,
  Plus,
  Camera,
  X
} from 'lucide-react'
// import { categories } from '../../data/mockData' // Removed mock data

// Helper to map icon string to Component
const IconMap = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Armchair: <Armchair className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Book: <Book className="w-5 h-5" />,
  Bike: <Bike className="w-5 h-5" />,
  Home: <HomeIcon className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
}

export function PostItem() {
  const navigate = useNavigate()
  const { id: productId } = useParams()
  const isEditMode = !!productId
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [dbCategories, setDbCategories] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: 'Good',
    price: '',
    originalPrice: '',
    description: '',
    location: '',
    image: '',
    images: [],
    quantity: 1,
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/products/${productId}`)
          if (res.ok) {
            const data = await res.json()
            setFormData({
              title: data.title,
              category: data.category,
              condition: data.condition,
              price: data.price,
              originalPrice: data.originalPrice || '',
              description: data.description || '',
              location: data.location || '',
              image: data.image || '',
              images: data.images || (data.image ? [data.image] : []),
              quantity: data.quantity || 1,
            })

          } else {
            setError('Failed to fetch product details')
          }
        } catch (err) {
          console.error(err)
          setError('Server error')
        } finally {
          setIsLoading(false)
        }
      }
      fetchProduct()
    }

    // 📋 Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories')
        const data = await res.json()
        if (Array.isArray(data)) {
          setDbCategories(data)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [isEditMode, productId])

  const conditions = [
    { label: 'New', desc: 'Seal never broken' },
    { label: 'Like New', desc: 'No visible signs of wear' },
    { label: 'Good', desc: 'Minor wear but functional' },
    { label: 'Fair', desc: 'Visible wear, works fine' }
  ]

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const totalImages = formData.images.length + files.length
    if (totalImages > 5) {
      setError('You can only upload up to 5 images')
      return
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Each image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => {
          const newImages = [...prev.images, reader.result]
          return {
            ...prev,
            images: newImages,
            // Set first image as main if not already set
            image: prev.image || newImages[0]
          }
        })
        setError('')
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      }
    })
  }

  const validateStep = () => {
    switch (step) {
      case 1:
        return !!formData.category
      case 2:
        return !!formData.title && !!formData.price && !!formData.originalPrice && !!formData.quantity && formData.quantity > 0
      case 3:
        return formData.images.length > 0
      case 4:
        return !!formData.description && !!formData.location
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1)
      setError('')
    } else {
      setError('Please fill in all required fields before continuing.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPublishing(true)
    setError('')

    const token = sessionStorage.getItem('token')
    if (!token) {
      setError('Your session has expired. Please login again.')
      setIsPublishing(false)
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    try {
      const url = isEditMode
        ? `http://localhost:5000/api/products/${productId}`
        : 'http://localhost:5000/api/products'

      const res = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Invalid or expired token. Please login again.')
        }
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'list'} product`)
      }

      // Success!
      navigate('/vendor/products')
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message)
      setIsPublishing(false)

      if (err.message.includes('token')) {
        setTimeout(() => navigate('/login'), 2500)
      }

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategorySelect = (catId) => {
    updateField('category', catId)
    setStep(2)
    setError('')
  }

  const progress = (step / 4) * 100

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:ml-64">
      {/* Top Navigation / Progress */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Listing' : 'Create Listing'}
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm font-bold text-primary">Step {step} of 4</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 max-w-7xl mx-auto">
            <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-bold">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left: Form Content */}
          <div className="lg:col-span-12 xl:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8">

                {/* STEP 1: CATEGORY */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-slate-900 mb-2">What are you selling?</h2>
                      <p className="text-slate-500 font-medium">Select the best category for your item to reach more buyers.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {dbCategories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => handleCategorySelect(cat._id)}
                          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${formData.category === cat._id
                            ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                            : 'border-slate-100 hover:border-primary/40 hover:bg-slate-50'
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.category === cat._id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                            {IconMap[cat.icon] || <Package className="w-6 h-6" />}
                          </div>
                          <span className={`text-sm font-bold tracking-tight ${formData.category === cat._id ? 'text-primary' : 'text-slate-600'}`}>
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-slate-900 mb-2">Basic Information</h2>
                      <p className="text-slate-500 font-medium">Tell us more about the item.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Item Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => updateField('title', e.target.value)}
                          placeholder="e.g. iPhone 13 Pro Max - 256GB"
                          className="w-full text-lg font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Asking Price (Rs.)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rs.</span>
                            <input
                              type="number"
                              value={formData.price}
                              onChange={(e) => updateField('price', e.target.value)}
                              placeholder="0.00"
                              className="w-full text-lg font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                            />
                          </div>
                        </div>
                        <div className="group">
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Original Price (Rs.)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rs.</span>
                            <input
                              type="number"
                              value={formData.originalPrice}
                              onChange={(e) => updateField('originalPrice', e.target.value)}
                              placeholder="MSRP / Bought Price"
                              className="w-full text-lg font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Available Quantity (Stock)</label>
                        <div className="relative">
                          <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => updateField('quantity', parseInt(e.target.value) || 1)}
                            placeholder="1"
                            className="w-full text-lg font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                          />
                        </div>
                        <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Specify how many units you have for sale.</p>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 group-focus-within:text-primary transition-colors">Item Condition</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {conditions.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => updateField('condition', item.label)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${formData.condition === item.label
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                }`}
                            >
                              <div className={`text-sm font-bold mb-1 ${formData.condition === item.label ? 'text-primary' : 'text-slate-700'}`}>{item.label}</div>
                              <div className="text-[10px] text-slate-400 font-medium leading-tight">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: MEDIA */}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-slate-900 mb-2">Photos & Visuals</h2>
                      <p className="text-slate-500 font-medium">Clear photos get you 80% more views.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-primary transition-colors">
                          Product Photos
                        </label>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {formData.images.map((img, index) => (
                            <div key={index} className="aspect-square relative rounded-2xl overflow-hidden border border-slate-200 group">
                              <img src={img} className="w-full h-full object-cover" alt={`Upload ${index}`} />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[8px] font-black uppercase text-center py-1">
                                  Main
                                </div>
                              )}
                            </div>
                          ))}

                          {formData.images.length < 5 && (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/40 transition-all hover:bg-primary/5 shadow-sm"
                            >
                              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-primary" />
                              </div>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center px-2 leading-tight">
                                Add Image
                              </span>
                            </div>
                          )}

                          {formData.images.length === 0 && [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center group cursor-not-allowed opacity-50">
                              <ImageIcon className="w-5 h-5 text-slate-200" />
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PUBLISH */}
                {step === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                    <div className="mb-8">
                      <h2 className="text-2xl font-black text-slate-900 mb-2">Final Details</h2>
                      <p className="text-slate-500 font-medium">Add a description and location to finalize your post.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Detailed Description</label>
                        <textarea
                          rows={6}
                          value={formData.description}
                          onChange={(e) => updateField('description', e.target.value)}
                          placeholder="Describe your item in detail (condition, age, features...)"
                          className="w-full font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300 resize-none"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-primary transition-colors">Pickup Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                            placeholder="e.g. Kathmandu, Nepal"
                            className="w-full font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex items-center space-x-2 px-8 py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center space-x-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => validateStep() ? handleSubmit(e) : setError('Please fill in all required fields.')}
                      disabled={isPublishing}
                      className="flex items-center space-x-2 px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-70"
                    >
                      {isPublishing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>{isEditMode ? 'Updating...' : 'Publishing...'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{isEditMode ? 'Update Listing' : 'Publish Listing'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[60]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Right: Live Preview (Sticky) */}
          <div className="hidden xl:block xl:col-span-4">
            <div className="sticky top-28">
              <div className="flex items-center space-x-2 mb-4 px-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</span>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl transition-all duration-500">
                <div className="aspect-[4/3] bg-slate-100 relative group overflow-hidden">
                  {formData.images.length > 0 ? (
                    <div className="w-full h-full relative">
                      <img src={formData.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                      {formData.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto no-scrollbar">
                          {formData.images.slice(1, 4).map((img, idx) => (
                            <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
                               <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                            </div>
                          ))}
                          {formData.images.length > 4 && (
                            <div className="w-10 h-10 rounded-lg border-2 border-white shadow-lg overflow-hidden flex-shrink-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">
                               +{formData.images.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-slate-100">
                      {formData.condition}
                    </span>
                  </div>
                </div>


                <div className="p-8">
                  <div className="mb-4">
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.15em] mb-1">
                      {dbCategories.find(c => c._id === formData.category)?.name || 'Category'}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-tight">
                      {formData.title || 'Untitled Listing'}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 mb-1 leading-none">Price</div>
                      <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                        Rs. {formData.price || '0'}
                      </div>
                    </div>
                    {formData.originalPrice && (
                      <div className="text-sm font-bold text-slate-300 line-through mb-1">
                        Rs. {formData.originalPrice}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">Store View</div>
                        <div className="text-[10px] font-bold text-slate-400 leading-none">Top Rated Vendor</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Container */}
              <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Quick Tip</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Listings with high-quality photos and detailed descriptions sell **3x faster** than others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

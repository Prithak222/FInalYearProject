import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  HeartIcon,
  ShoppingCartIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  PackageIcon,
  Share2Icon,
  ChevronRightIcon,
  StarIcon,
  MessageCircleIcon,
  TruckIcon,
  RotateCcwIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { QuickChat } from '../components/QuickChat'


export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, refreshCartCount } = useAuth()
  const { showToast } = useToast()



  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showQuickChat, setShowQuickChat] = useState(false)

  // API Configuration
  const API_BASE = 'http://localhost:5000/api'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}`)
        const data = await res.json()
        setProduct(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching product', err)
        setLoading(false)
      }
    }

    const checkStatus = async () => {
      if (!isLoggedIn) return
      const token = sessionStorage.getItem('token')
      
      try {
        // Check wishlist
        const wRes = await fetch(`${API_BASE}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const wData = await wRes.json()
        if (Array.isArray(wData)) {
          setIsWishlisted(wData.some(item => item.productId?._id === id))
        }

        // Check cart
        const cRes = await fetch(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const cData = await cRes.json()
        if (Array.isArray(cData)) {
          setInCart(cData.some(item => item.productId?._id === id))
        }
      } catch (err) {
        console.error('Error checking user status', err)
      }
    }

    fetchProduct()
    checkStatus()
  }, [id, isLoggedIn])

  const requireLogin = () => {
    navigate('/login', { state: { from: { pathname: `/product/${id}` } } })
  }

  const handleWishlist = async () => {
    if (!isLoggedIn) return requireLogin()
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`${API_BASE}/wishlist/toggle/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setIsWishlisted(data.wishlisted)
      showToast(data.wishlisted ? "Added to Wishlist!" : "Removed from Wishlist!", "success")

    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) return requireLogin()
    const token = sessionStorage.getItem('token')
    try {
      if (inCart) {
        // Optional: Implement remove from cart if already in cart
        // For now, just keep as is or redirect to cart
        navigate('/cart')
        return
      }

      const res = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId: id })
      })
      const data = await res.json()
      if (data.success || data.message === "Product added to cart successfully") {
        setInCart(true)
        setAddedToCart(true)
        refreshCartCount()
        showToast("Product added to cart!", "success")
        setTimeout(() => setAddedToCart(false), 2000)
      } else {
        showToast("Failed to add to cart: " + data.message, "error")
      }

    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center max-w-md border border-slate-100">
           <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <PackageIcon className="w-12 h-12 text-red-300" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-2">Item Unavailable</h2>
           <p className="text-slate-500 mb-8 leading-relaxed font-medium">This product might have been sold or the listing has expired. Let's find you something else!</p>
           <Link to="/" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20">
             <ArrowLeftIcon className="w-4 h-4 mr-2" />
             Back to Catalog
           </Link>
        </div>
      </div>
    )
  }

  // Gallery logic
  const images = product.images?.length > 0 ? product.images : [product.image].filter(Boolean)
  if (images.length === 0) images.push('https://via.placeholder.com/800x800?text=Premium+Listing')

  return (
    <div className="min-h-screen bg-[#fafbfc] select-none">
      
      {/* Dynamic Header Overlay */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-600 z-[60]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
        
        {/* Superior Navigation */}
        <div className="mb-10 flex items-center justify-between">
           <nav className="flex items-center space-x-2 text-sm font-bold text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Marketplace</Link>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
              <Link to={`/categories?category=${product.category?._id || product.category}`} className="hover:text-primary transition-colors">{product.category?.name || (typeof product.category === 'string' ? product.category : 'Uncategorized')}</Link>
              <ChevronRightIcon className="w-4 h-4 text-slate-300" />
              <span className="text-slate-900 truncate max-w-[150px]">{product.title}</span>
           </nav>
           
           <div className="flex items-center space-x-3">
              <button className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all text-slate-500 hover:text-slate-900 active:scale-90">
                 <Share2Icon className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Cinematic Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group rounded-[3.5rem] overflow-hidden bg-white border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] aspect-square lg:sticky lg:top-28">
              <img
                src={images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              
              {/* Badges Overlay */}
              <div className="absolute top-8 left-8 flex flex-col space-y-3">
                 <span className="px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-white/50 shadow-xl">
                    {product.category?.name || (typeof product.category === 'string' ? product.category : 'Uncategorized')}
                 </span>
                 <span className="px-5 py-2 bg-slate-900/80 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                    {product.condition}
                 </span>
                 {product.status === 'sold' && (
                   <span className="px-5 py-2 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl animate-pulse">
                     SOLD
                   </span>
                 )}
              </div>

              {product.status === 'sold' && (
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[5] flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-3xl rotate-[-12deg] shadow-2xl">
                    <span className="text-white text-5xl font-black uppercase tracking-[0.3em]">SOLD</span>
                  </div>
                </div>
              )}

              {/* Verified Product Float */}
              <div className="absolute bottom-8 right-8 px-5 py-3 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl flex items-center space-x-3">
                 <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Verified</span>
                    <span className="text-[12px] font-bold text-slate-900 leading-tight">Authentic Listing</span>
                 </div>
              </div>
            </div>
            
            {/* Elegant Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                 {images.map((img, idx) => (
                   <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-[1.5rem] bg-white border-2 transition-all p-1 ${
                      activeImage === idx ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                   >
                     <img src={img} className="w-full h-full object-cover rounded-[1.2rem]" alt={`thumb-${idx}`} />
                   </button>
                 ))}
              </div>
            )}
          </div>

          {/* Right: Premium Details Panel */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Pricing & Control Card */}
            <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              
              <div className="space-y-6 mb-12">
                <div className="flex items-center space-x-2">
                   <div className="flex space-x-0.5">
                      {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">(4.8 Listing Score)</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                      <MapPinIcon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-slate-600">{product.location || 'Kathmandu'}</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400">Listed {new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-12">
                 <div className="flex items-baseline space-x-4">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                      <span className="text-2xl font-black mr-1 text-slate-400">Rs.</span>
                      {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <div className="flex flex-col">
                         <span className="text-xs font-black text-red-500 uppercase tracking-widest animate-pulse">
                           {Math.round((1 - product.price/product.originalPrice) * 100)}% OFF
                         </span>
                         <span className="text-xl text-slate-300 line-through font-bold">
                           Rs.{product.originalPrice.toLocaleString()}
                         </span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.status === 'sold'}
                  className={`group relative w-full py-6 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center space-x-3 overflow-hidden ${
                    product.status === 'sold'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : addedToCart
                      ? 'bg-green-500 text-white shadow-green-200'
                      : inCart
                      ? 'bg-slate-900 text-white shadow-slate-200'
                      : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50'
                  }`}
                >
                  {product.status === 'sold' ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : addedToCart ? (
                    <ShieldCheckIcon className="w-6 h-6 animate-bounce" />
                  ) : inCart ? (
                    <ShoppingCartIcon className="w-6 h-6" />
                  ) : (
                    <ShoppingCartIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  )}
                  <span>{product.status === 'sold' ? 'Item Already Sold' : addedToCart ? 'Product Secured' : inCart ? 'View in Cart' : 'Secure This Deal'}</span>
                </button>

                <button
                  onClick={handleWishlist}
                  className={`w-full py-5 rounded-2xl font-black text-base border-2 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'bg-red-50 border-red-100 text-red-500'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-red-100 hover:text-red-500 hover:bg-red-50/20'
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''} transition-all duration-300`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Merchant Intelligence Card */}
            <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
               {/* Decorative Background */}
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
               
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center overflow-hidden shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-500">
                          {product.vendor?.shopLogo ? (
                            <img src={product.vendor.shopLogo} alt={product.vendor.shopName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl font-black text-white">{(product.vendor?.shopName || product.vendor?.name || 'V').charAt(0)}</span>
                          )}
                        </div>
                        <div>
                           <h3 className="text-xl font-black leading-tight tracking-tight uppercase">{product.vendor?.shopName || product.vendor?.name || 'Merchant'}</h3>
                           <div className="flex items-center space-x-2 text-primary">
                             <ShieldCheckIcon className="w-4 h-4 fill-primary text-slate-900" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Premium Verified Dealer</span>
                           </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => isLoggedIn ? setShowQuickChat(true) : requireLogin()}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/5 transition-all active:scale-90"
                     >
                        <MessageCircleIcon className="w-6 h-6" />
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-white/5 rounded-[1.5rem] p-5 border border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Deal History</p>
                        <p className="text-lg font-bold">Verified Seller</p>
                     </div>
                     <div className="bg-white/5 rounded-[1.5rem] p-5 border border-white/5">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Since</p>
                        <p className="text-lg font-bold">{product.vendor?.createdAt ? new Date(product.vendor.createdAt).getFullYear() : '2024'}</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/shop/${product.vendor?._id || ''}`)}
                    className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all active:scale-98 shadow-xl uppercase tracking-widest text-sm"
                  >
                    Visit Shop Profile
                  </button>
               </div>
            </div>

            {/* Insights & Specs Header */}
            <div className="p-2">
               <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-100 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                     <TruckIcon className="w-6 h-6 text-indigo-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight line-clamp-2">Protected Shipping</span>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-100 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                     <RotateCcwIcon className="w-6 h-6 text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight line-clamp-2">Authentic Guarantee</span>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-slate-100 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                     <ShieldCheckIcon className="w-6 h-6 text-amber-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight line-clamp-2">Secure Payment</span>
                  </div>
               </div>
            </div>

            {/* The Intelligence Brief (Description) */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-12 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.04)]">
               <div className="flex items-center space-x-3 mb-8">
                  <div className="w-1.5 h-8 bg-primary rounded-full" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Editor's Notes & Details</h3>
               </div>
               <p className="text-slate-700 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {product.description || 'Welcome to a higher standard of pre-owned luxury. This item has been hand-selected for our marketplace, representing the perfect balance of value and premium quality. Each detail has been analyzed to ensure it meets the DosroDeal standard for circular excellence.'}
               </p>
               
               <div className="mt-12 pt-8 border-t border-slate-50">
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-bold text-slate-400">Authenticity Certificate</span>
                     <span className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">DD-482093</span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 flex gap-3">
         <button 
           onClick={handleWishlist}
           className="p-4 bg-slate-100 rounded-2xl text-slate-900 active:scale-90"
         >
           <HeartIcon className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
         </button>
         <button 
           onClick={handleAddToCart}
           disabled={product.status === 'sold'}
           className={`flex-1 py-4 font-black rounded-2xl shadow-xl active:scale-95 transition-all ${
             product.status === 'sold' 
               ? 'bg-slate-200 text-slate-400 font-bold shadow-none' 
               : 'bg-primary text-white shadow-primary/20'
           }`}
         >
           {product.status === 'sold' ? 'SOLD OUT' : inCart ? 'View Cart' : 'Reserve Deal'}
         </button>
      </div>

      {showQuickChat && (
        <QuickChat 
          otherUser={product.vendor}
          productId={product._id}
          onClose={() => setShowQuickChat(false)}
        />
      )}

    </div>
  )
}

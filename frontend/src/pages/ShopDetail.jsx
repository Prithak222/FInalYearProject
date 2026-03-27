import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  StoreIcon, 
  MapPinIcon, 
  StarIcon, 
  CalendarIcon, 
  InfoIcon, 
  PackageIcon,
  ChevronRightIcon
} from 'lucide-react'

export function ShopDetail() {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = 'http://localhost:5000'

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        // Fetch Vendor Info
        const vendorRes = await fetch(`${API_BASE}/auth/vendor/${id}`)
        const vendorData = await vendorRes.json()
        setVendor(vendorData)

        // Fetch Vendor Products
        const productsRes = await fetch(`${API_BASE}/products?vendor=${id}`)
        const productsData = await productsRes.json()
        setProducts(productsData)
      } catch (err) {
        console.error('Error fetching shop data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Entering Shop...</p>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <StoreIcon className="mx-auto text-slate-300" size={64} />
          <h2 className="text-2xl font-black text-slate-900">Shop Not Found</h2>
          <Link to="/" className="text-primary font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner Section */}
      <div className="relative h-64 md:h-80 bg-slate-200 overflow-hidden">
        {vendor.shopBanner ? (
          <img 
            src={vendor.shopBanner} 
            alt="Shop Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
             <StoreIcon className="text-white/10" size={120} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Shop Info Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 text-center md:text-left">
              {/* Logo */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2rem] p-1 shadow-2xl shadow-slate-200 border border-slate-100 flex-shrink-0 -mt-20 md:-mt-24 overflow-hidden">
                {vendor.shopLogo ? (
                  <img src={vendor.shopLogo} alt={vendor.shopName} className="w-full h-full object-cover rounded-[1.8rem]" />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                    <StoreIcon size={48} />
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 pt-4">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {vendor.shopName || vendor.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 font-medium">
                  {vendor.category && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {vendor.category}
                    </span>
                  )}
                  <div className="flex items-center space-x-1">
                    <StarIcon size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-slate-900 font-bold">4.8</span>
                    <span className="text-slate-400 text-sm">(124 Reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CalendarIcon size={14} />
                    <span>Member since {new Date(vendor.createdAt).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 md:flex-none px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                Follow Shop
              </button>
              <button className="flex-1 md:flex-none px-6 py-3 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
                Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 pt-10 border-t border-slate-100">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <InfoIcon size={18} />
                <span>About the Shop</span>
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {vendor.shopDescription || "No description provided."}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <PackageIcon size={18} />
                <span>Shop Policies</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-sm font-medium">Returns</span>
                  <span className="text-slate-900 text-sm font-bold">{vendor.returnPolicy || '7-day returns'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 text-sm font-medium">Hours</span>
                  <span className="text-slate-900 text-sm font-bold">{vendor.businessHours || 'Open now'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Products</h2>
          <p className="text-slate-500 font-bold">{products.length} Items</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <Link 
                key={item._id} 
                to={`/product/${item._id}`}
                className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-[10px] font-black uppercase tracking-wider text-slate-900">
                      {item.condition}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xl font-black text-slate-900">Rs. {item.price}</p>
                    <ChevronRightIcon className="text-slate-300 group-hover:translate-x-1 group-hover:text-primary transition-all" size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
             <PackageIcon className="mx-auto text-slate-200 mb-4" size={48} />
             <p className="text-slate-400 font-bold">This vendor hasn't posted any products yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

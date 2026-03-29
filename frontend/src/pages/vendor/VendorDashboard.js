import React from 'react'
import { Link } from 'react-router-dom'
import {
  PackageIcon,
  EyeIcon,
  HeartIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  PlusCircleIcon,
  AlertCircleIcon,
} from 'lucide-react'

export function VendorDashboard() {
  const [vendor, setVendor] = React.useState(null)
  const [products, setProducts] = React.useState([])
  const [statsData, setStatsData] = React.useState({
    activeListings: 0,
    totalViews: 0,
    wishlistSaves: 0,
    messages: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [productsLoading, setProductsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchVendorStatus = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setVendor(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchDashboardData = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) return;
      try {
        // Fetch stats
        const statsRes = await fetch('http://localhost:5000/api/products/vendor/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (statsRes.ok) {
          const sData = await statsRes.json()
          setStatsData(sData)
        }

        // Fetch products
        const productsRes = await fetch('http://localhost:5000/api/products/vendor', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (productsRes.ok) {
          const pData = await productsRes.json()
          setProducts(pData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setProductsLoading(false)
      }
    }

    fetchVendorStatus()
    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Vendor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {vendor?.name || 'User'}! Here's your shop overview.
          </p>
        </div>

        {/* Verification Alert */}
        {!loading && vendor && !vendor.isVendorApproved && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
            <AlertCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                Verification Pending
              </h3>
              <p className="text-sm text-amber-800 mb-2">
                Your account is currently under review by the admin. You cannot add products until approved.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: PackageIcon, bg: 'bg-primary/10', color: 'text-primary', title: 'Active Listings', value: statsData.activeListings },
            { icon: EyeIcon, bg: 'bg-blue-100', color: 'text-blue-600', title: 'Total Views', value: statsData.totalViews.toLocaleString() },
            { icon: HeartIcon, bg: 'bg-red-100', color: 'text-red-600', title: 'Wishlist Saves', value: statsData.wishlistSaves },
            { icon: MessageSquareIcon, bg: 'bg-amber-100', color: 'text-amber-600', title: 'Messages', value: statsData.messages },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/vendor/post"
              className="p-6 bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <PlusCircleIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Add New Product</h3>
              <p className="text-sm text-muted-foreground">List a new item for sale</p>
            </Link>

            <Link
              to="/messages"
              className="p-6 bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MessageSquareIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">View Inquiries</h3>
              <p className="text-sm text-muted-foreground">Respond to buyer messages</p>
            </Link>

            <Link
              to="/vendor/profile"
              className="p-6 bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <TrendingUpIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Update Shop Profile</h3>
              <p className="text-sm text-muted-foreground">Edit shop details and settings</p>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Recent Products</h2>
            <Link to="/vendor/products" className="text-sm font-medium text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {productsLoading ? (
              <div className="p-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length > 0 ? (
              products.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="p-4 flex items-center space-x-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <PackageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">{product.category?.name || (typeof product.category === 'string' ? product.category : 'Uncategorized')}</span>
                      <span className="flex items-center space-x-1">
                        <EyeIcon className="w-3.5 h-3.5" />
                        <span>{product.views || 0}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">Rs. {product.price}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-sm">No products listed yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

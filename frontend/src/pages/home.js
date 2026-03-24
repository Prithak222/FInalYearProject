import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  LeafIcon,
  Smartphone,
  Armchair,
  Shirt,
  Book,
  Bike,
  Home as HomeIcon,
  Gamepad2,
  Package,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { SearchBar } from '../components/SearchBar'
import { ProductCard } from '../components/ProductCard'
import { mockProducts } from '../data/mockData' // Removed mock categories import

export function Home() {
  const { isLoggedIn, userRole } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])



  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const [products, setProducts] = useState([])
  const [dbCategories, setDbCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 📋 Fetch products
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data.slice(0, 6) : [])
      })
      .catch(err => console.error('Error fetching home products', err))

    // 📋 Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCategories(data.slice(0, 8)) // Show top 8
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching home categories', err)
        setLoading(false)
      })
  }, [])

  const IconMap = {
    Smartphone: <Smartphone className="w-6 h-6" />,
    Armchair: <Armchair className="w-6 h-6" />,
    Shirt: <Shirt className="w-6 h-6" />,
    Book: <Book className="w-6 h-6" />,
    Bike: <Bike className="w-6 h-6" />,
    Home: <HomeIcon className="w-6 h-6" />,
    Gamepad2: <Gamepad2 className="w-6 h-6" />,
    Package: <Package className="w-6 h-6" />,
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-[1.1] tracking-tighter">
              Give items a <span className="text-primary italic">second</span> life.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium">
              DosroDeal is the community marketplace where quality second-hand finds meet their next home. Sustainable, simple, and safe.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <SearchBar placeholder="Search for electronics, furniture..." className="max-w-xl w-full" />
              {isLoggedIn && (
                <Link
                  to="/vendor/register"
                  className="btn-primary px-8 py-3.5"
                >
                  Start Selling
                </Link>
              )}
            </div>
          </div>

          {/* Features - Non-uniform layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
            <div className="md:col-span-5 p-6 bg-white rounded-2xl border border-slate-100 shadow-premium flex flex-col justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Verified Sellers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every vendor on our platform undergoes a verification process to ensure trust and reliability in every transaction.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900 rounded-2xl text-white flex flex-col justify-between">
                <LeafIcon className="w-8 h-8 text-emerald-400 mb-4" />
                <div>
                  <h3 className="text-lg font-bold mb-1">Sustainable Choice</h3>
                  <p className="text-xs text-slate-300 font-medium opacity-80">
                    Reduce CO2 footprint by choosing pre-loved items.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-accent rounded-2xl text-white flex flex-col justify-between">
                <TrendingUpIcon className="w-8 h-8 text-white mb-4" />
                <div>
                  <h3 className="text-lg font-bold mb-1">Incredible Value</h3>
                  <p className="text-xs text-white/80 font-medium">
                    Find high-end brands at up to 70% off retail prices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - varied spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-12 bg-white/50 rounded-[3rem] border border-slate-100/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-foreground mb-2">Browse by Category</h2>
            <p className="text-muted-foreground font-medium">What are you looking for today?</p>
          </div>
          <Link
            to="/categories"
            className="group btn-secondary bg-transparent hover:bg-slate-50 border-none shadow-none text-primary font-bold flex items-center space-x-2"
          >
            <span>View All Collections</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
          {dbCategories.map((category) => (
            <Link
              key={category._id}
              to={`/categories?category=${category._id}`}
              className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-premium-hover transition-all group scale-100 hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/5 transition-colors">
                <span className="text-primary grayscale group-hover:grayscale-0 transition-all">
                  {IconMap[category.icon] || <Package className="w-6 h-6" />}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground text-center line-clamp-1">
                {category.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mt-1.5 opacity-60">
                Browse
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Items Section - Non-uniform grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-foreground">Featured Selection</h2>
          <div className="hidden md:flex items-center gap-2">
            <span className="h-0.5 w-12 bg-slate-200"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Hand-Picked for You</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <div key={product._id} className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
                 <ProductCard
                  product={product}
                  onWishlistToggle={toggleWishlist}
                  isWishlisted={wishlist.includes(product._id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground font-medium">
              Our shelves are currently being restocked. Check back soon!
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Organic look */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-accent opacity-20 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to clear some space?
            </h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Join thousands of people who list their pre-loved items on DosroDeal every day. It's fast, free, and local.
            </p>
            <Link
              to="/post"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-xl font-black hover:bg-primary hover:text-white transition-all shadow-xl hover:-translate-y-1 active:scale-95 group"
            >
              <span>Start Selling Now</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRightIcon,
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
import { ProductCard } from '../components/ProductCard'

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
  const [featuredHeroProduct, setFeaturedHeroProduct] = useState(null)

  useEffect(() => {
    // Fetch products
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Increase limit to show more products
          setProducts(data.slice(0, 20))
          // Pick a random product for the hero card
          const random = data[Math.floor(Math.random() * data.length)]
          setFeaturedHeroProduct(random)
        }
      })
      .catch(err => console.error('Error fetching home products', err))

    // Fetch categories
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCategories(data.slice(0, 8))
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

  // Handle Pick another random product for the hero card
  const handleNextFeatured = () => {
    if (products.length > 0) {
      const random = products[Math.floor(Math.random() * products.length)]
      setFeaturedHeroProduct(random)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 overflow-x-hidden">
      {/* Hero Section - Blue Box Promo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3a8a] rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl">
          {/* Background effects */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Featured Selection</span>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tighter">
              Elevate Your <br />
              <span className="text-primary italic font-light">Audio Journey</span>
            </h2>
            <p className="text-slate-300 mb-10 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Experience sound in its purest form. Discover high-quality, pre-loved treasures or give your items a new home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="btn-premium px-12 py-5 bg-white text-black hover:bg-slate-100 shadow-2xl shadow-white/10 w-full sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                to="/categories"
                className="px-12 py-5 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all text-lg w-full sm:w-auto text-center"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Collection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Browse by <span className="text-primary italic">Collection</span></h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Curated items from our community, organized by what matters to you.
            </p>
          </div>
          <Link
            to="/categories"
            className="group flex items-center gap-3 text-slate-900 font-bold hover:text-primary transition-colors"
          >
            <span className="uppercase tracking-[0.2em] text-xs">View All Collections</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:translate-x-1 transition-all">
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10">
          {dbCategories.map((category) => (
            <Link
              key={category._id}
              to={`/categories?category=${category._id}`}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/5 group-hover:scale-110 transition-all duration-500 border border-transparent group-hover:border-primary/20">
                <span className="text-slate-400 group-hover:text-primary transition-colors">
                  {IconMap[category.icon] || <Package className="w-6 h-6" />}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900 text-center line-clamp-1 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended for You Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Curated Just For You</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Recommended <span className="italic font-light">for you</span></h2>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center opacity-50 cursor-not-allowed">
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all cursor-pointer">
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onWishlistToggle={toggleWishlist}
              isWishlisted={wishlist.includes(product._id)}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary opacity-20 blur-[120px] rounded-full group-hover:opacity-30 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-accent opacity-20 blur-[120px] rounded-full group-hover:opacity-30 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-8 block">Join the Revolution</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Ready to give your <br /> items a <span className="italic text-primary font-light">second life?</span>
            </h2>
            <p className="text-slate-400 mb-12 text-xl font-medium leading-relaxed">
              Join thousands of people who list their pre-loved items on DosroDeal every day. High value, low effort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/register"
                className="btn-premium px-12 py-5 bg-white text-black hover:bg-slate-100"
              >
                Start Selling Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

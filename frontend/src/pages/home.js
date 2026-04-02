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
import heroBg from '../assets/hero-bg.png'

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
          setProducts(data.slice(0, 6))
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
      {/* Hero Section */}
      <div className="relative h-[95vh] w-full flex items-center pt-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tighter drop-shadow-2xl">
              A second life <br />
              <span className="italic font-light">makes it real</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              <Link
                to="/register"
                className="btn-premium px-12 py-5 text-lg"
              >
                Get Started
              </Link>
              <p className="text-white/90 text-lg font-medium max-w-xs drop-shadow-md">
                Find unique pre-loved treasures or give your items a new home. No hidden fees.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Floating Card */}
        {featuredHeroProduct && (
          <div className="absolute bottom-12 right-12 z-20 hidden lg:block animate-float">
            <div className="glass-card w-80 group overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Featured Piece</span>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
              
              <Link to={`/product/${featuredHeroProduct._id}`} className="block relative h-40 rounded-xl overflow-hidden mb-4 group/img">
                <img 
                  src={featuredHeroProduct.image} 
                  alt={featuredHeroProduct.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-lg font-bold text-white leading-tight">{featuredHeroProduct.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                      {featuredHeroProduct.category?.name || 'Curated'}
                    </span>
                    <span className="text-[10px] font-black text-primary uppercase">Rs. {featuredHeroProduct.price}</span>
                  </div>
                </div>
              </Link>

              <div 
                onClick={handleNextFeatured}
                className="flex items-center justify-between group/btn cursor-pointer"
              >
                <h3 className="text-2xl font-black italic tracking-tighter">Refresh</h3>
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-primary group-hover/btn:bg-primary transition-all">
                  <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
              <p className="text-sm text-white/60 mt-2 font-medium">Explore our curated selection for 2024</p>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
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

      {/* Featured Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-50">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Hand-Picked</span>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Featured Selection</h2>
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

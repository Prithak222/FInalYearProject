import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { SearchBar } from '../components/SearchBar'
import { mockProducts } from '../data/mockData'
import { FilterSidebar } from '../components/filtersidebar'
import { ProductCard } from '../components/ProductCard'
import { LayoutGridIcon, ListIcon } from 'lucide-react'

export function Categories() {
  const { isLoggedIn, userRole } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])


  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const [products, setProducts] = useState([])

  const location = useLocation()
  
  // Parse initial filters from URL on component mount
  const getInitialFilters = () => {
    const queryParams = new URLSearchParams(location.search)
    const categoryParam = queryParams.get('category')
    return {
      minPrice: 0,
      maxPrice: 100000,
      condition: [],
      category: categoryParam ? [categoryParam] : [],
      search: '',
    }
  }

  const [filters, setFilters] = useState(getInitialFilters())

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const { minPrice, maxPrice, condition, category } = filters
    const query = new URLSearchParams()
    if (minPrice) query.set('minPrice', minPrice)
    if (maxPrice) query.set('maxPrice', maxPrice)
    if (condition.length > 0) query.set('condition', condition.join(','))
    if (category.length > 0) query.set('category', category.join(','))
    if (filters.search) query.set('search', filters.search)

    fetch(`http://localhost:5000/api/products?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort: Active items first, Sold items at the bottom
          const sortedProducts = [...data].sort((a, b) => {
            if (a.status === 'sold' && b.status !== 'sold') return 1;
            if (a.status !== 'sold' && b.status === 'sold') return -1;
            return 0;
          });
          setProducts(sortedProducts)
        } else {
          setProducts([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching categories products', err)
        setLoading(false)
      })
  }, [filters])



  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Explore <span className="text-primary italic">DosroDeal</span></h1>
          <p className="text-muted-foreground font-medium mb-8 max-w-xl">Discover unique pre-loved items from verified sellers in your community.</p>

          <div className="max-w-2xl">
            <SearchBar
              placeholder="What are you searching for?"
              onSearch={(query) => setFilters(prev => ({ ...prev, search: query }))}
              onFilterClick={() => setShowFilters(!showFilters)}
            />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Found{' '}
            <span className="text-foreground">
              {products.length}
            </span>{' '}
            Curated Items
          </p>

          <div className="flex items-center space-x-1 bg-muted p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <LayoutGridIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
              <FilterSidebar
                isOpen={true}
                onClose={() => setShowFilters(false)}
                onApply={setFilters}
                initialFilters={filters}
              />
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
                  }`}
              >
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <div key={product._id} className={viewMode === 'grid' && index % 5 === 0 ? "md:col-span-2 lg:col-span-1" : ""}>
                      <ProductCard
                        product={product}
                        onWishlistToggle={toggleWishlist}
                        isWishlisted={wishlist.includes(product._id)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-muted-foreground font-medium">No items found matching your filters.</p>
                    <button 
                      onClick={() => setFilters({ minPrice: 0, maxPrice: 100000, condition: [], category: [] })}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Reset all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

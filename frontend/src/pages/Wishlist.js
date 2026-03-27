import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, Trash2Icon, PackageIcon, ArrowLeftIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Wishlist() {
  const { isLoggedIn } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    const token = sessionStorage.getItem('token')
    fetch('http://localhost:5000/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isLoggedIn])

  const handleRemove = async (productId) => {
    const token = sessionStorage.getItem('token')
    try {
      await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(items.filter(item => item.productId?._id !== productId))
    } catch (err) {
      console.error(err)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <HeartIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view your wishlist</h2>
        <Link to="/login" className="text-primary hover:underline font-medium">Login →</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center space-x-3 mb-8">
          <HeartIcon className="w-6 h-6 text-red-500" />
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div key={item._id} className="flex items-center bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                  <Link to={`/product/${product._id}`} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted mr-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/200?text=No+Image'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                      {product.title}
                    </Link>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-foreground">Rs. {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                      <span className="bg-muted px-2 py-0.5 rounded capitalize">{product.condition}</span>
                      <span>•</span>
                      <span>{product.vendor?.name || 'Vendor'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(product._id)}
                    className="flex-shrink-0 ml-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-border rounded-2xl">
            <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold text-foreground mb-1">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Browse products and save your favorites here.</p>
            <Link to="/categories" className="inline-flex items-center px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

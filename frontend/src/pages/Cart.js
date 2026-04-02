import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon, Trash2Icon, PackageIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'


export function Cart() {
  const { isLoggedIn, refreshCartCount } = useAuth()
  const { showToast } = useToast()


  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    fetchCart()
  }, [isLoggedIn])

  const handleRemove = async (productId) => {
    const token = sessionStorage.getItem('token')
    try {
      await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(items.filter(item => item.productId?._id !== productId))
      refreshCartCount()

    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1) return
    const token = sessionStorage.getItem('token')
    try {
      await fetch(`http://localhost:5000/api/cart/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ productId, quantity: newQty })
      })
      setItems(items.map(item => 
        item.productId?._id === productId ? { ...item, quantity: newQty } : item
      ))
      refreshCartCount()
    } catch (err) {
      console.error(err)
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.productId?.price * item.quantity || 0), 0)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <ShoppingCartIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Sign in to view your cart</h2>
        <Link to="/login" className="text-primary hover:underline font-medium">Login →</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">

        <div className="flex items-center space-x-3 mb-8">
          <ShoppingCartIcon className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">My Cart</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
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
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-border rounded-lg bg-slate-50">
                          <button 
                            onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                            className="px-3 py-1 text-lg font-medium hover:text-primary transition-colors"
                          >-</button>
                          <span className="px-2 font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                            className="px-3 py-1 text-lg font-medium hover:text-primary transition-colors"
                          >+</button>
                        </div>
                        <button
                          onClick={() => handleRemove(product._id)}
                          className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:block text-right ml-4">
                      <div className="text-lg font-black text-foreground">Rs. {product.price * item.quantity}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">Rs. {totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-xl font-black text-foreground">Rs. {totalPrice}</span>
                    </div>
                  </div>
                </div>
                <Link to="/checkout" className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/25 inline-flex justify-center items-center">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-border rounded-2xl">
            <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-bold text-foreground mb-1">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Discover great deals and add items to your cart.</p>
            <Link to="/categories" className="inline-flex items-center px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Package, ChevronRight, Calendar, Clock, MapPin, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function MyOrders() {
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders()
    }
  }, [isLoggedIn])

  const fetchOrders = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'processing': return 'bg-amber-100 text-amber-700'
      case 'pending': return 'bg-slate-100 text-slate-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
              <p className="text-slate-500 text-sm font-medium">Manage and track your recent orders</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none w-full md:w-64 shadow-sm"
            />
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                {/* Order Header */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Order <span className="text-slate-900 ml-1">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center text-sm text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 mr-1.5 opacity-60" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-7 space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} × Rs. {item.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900">Rs. {item.quantity * item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Meta Info */}
                    <div className="lg:col-span-5 lg:border-l lg:border-slate-100 lg:pl-8 space-y-4">
                      <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shipping To</p>
                            <p className="text-sm font-bold text-slate-700">{order.shippingInfo.name}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{order.shippingInfo.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 pt-2 border-t border-slate-200/60">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <div className="flex flex-1 justify-between items-center">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Amount</p>
                            <p className="text-lg font-black text-primary">Rs. {order.totalAmount}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/product/${order.items[0]?.productId}`}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <span>View One Item</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No orders found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start exploring our categories to find amazing deals!</p>
            <Link to="/categories" className="inline-flex items-center px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

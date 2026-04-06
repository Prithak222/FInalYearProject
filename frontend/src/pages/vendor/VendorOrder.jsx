import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SearchIcon,
  FilterIcon,
  MessageSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  UserIcon,
  MapPinIcon,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function VendorOrders() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
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
      const res = await fetch('http://localhost:5000/api/orders/vendor-orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setOrders(data)
      }
    } catch (err) {
      console.error('Error fetching vendor orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (res.ok) {
        // Update local state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Connection error')
    }
  }

  const handleChat = (userId) => {
    if (userId) {
      navigate(`/vendor/chat?user=${userId}`)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const statusMatch = activeTab === 'all' || order.orderStatus.toLowerCase() === activeTab.toLowerCase()
    const searchMatch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    return statusMatch && searchMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              Store Orders
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage fulfillment and track your sales performance
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Sales</span>
               <span className="text-lg font-black text-slate-900">Rs. {orders.reduce((sum, o) => sum + o.totalAmount, 0)}</span>
             </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex-1 w-full relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm">
            <FilterIcon className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="border-b border-slate-50 flex overflow-x-auto no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-sm font-bold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab} ({tab === 'all' ? orders.length : orders.filter(o => o.orderStatus.toLowerCase() === tab).length})
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="divide-y divide-slate-50">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Product Info */}
                  <div className="lg:w-1/3 flex space-x-4">
                    <div className="relative">
                      <img
                        src={order.items[0]?.image || 'https://via.placeholder.com/200'}
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      {order.items.length > 1 && (
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                          +{order.items.length - 1} More
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {order.items[0]?.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center space-x-2 mt-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.orderStatus.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          order.orderStatus.toLowerCase() === 'processing' ? 'bg-indigo-100 text-indigo-700' :
                          order.orderStatus.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.orderStatus.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="lg:w-1/3 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{order.shippingInfo.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-500 line-clamp-1">{order.shippingInfo.address}</span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="lg:w-1/3 flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
                      <p className="text-xl font-black text-slate-900">Rs. {order.totalAmount}</p>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => handleChat(order.userId)}
                        className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                      >
                        <MessageSquareIcon className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                      {order.orderStatus.toLowerCase() === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Processing')}
                          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                          <ClockIcon className="w-4 h-4" />
                          <span>Process Order</span>
                        </button>
                      )}
                      
                      {order.orderStatus.toLowerCase() === 'processing' && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Shipped')}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-100"
                        >
                          <PackageIcon className="w-4 h-4" />
                          <span>Confirm Shipment</span>
                        </button>
                      )}

                      {order.orderStatus.toLowerCase() === 'shipped' && (
                        <button 
                          onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )) : (
              <div className="py-20 text-center">
                <PackageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No orders here yet</h3>
                <p className="text-slate-500 text-sm">When customers buy your products, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

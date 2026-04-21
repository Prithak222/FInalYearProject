import React, { useState, useEffect } from 'react'
import {
  SearchIcon,
  AlertTriangleIcon,
  PackageIcon,
  Trash2Icon,
} from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function Listings() {
  const { showToast } = useToast()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/products/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setListings(data)
      }
    } catch (err) {
      console.error('Error fetching admin listings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) return
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setListings(prev => prev.filter(item => item._id !== id))
        showToast('Product deleted successfully!', 'success')
      } else {
        showToast('Failed to delete the product. Please try again.', 'error')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.vendor?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Stats calculation
  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    pending: listings.filter(l => l.status === 'pending').length,
    flagged: listings.filter(l => l.status === 'flagged').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 md:ml-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Listing Management
          </h1>
          <p className="text-slate-500 font-medium">
            Monitor and moderate product listings across the platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
            <div className="text-3xl font-black text-slate-900 mb-1">{stats.total}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Listings</div>
          </div>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm border-l-4 border-l-green-500">
            <div className="text-3xl font-black text-green-600 mb-1">{stats.active}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Storefront</div>
          </div>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm border-l-4 border-l-amber-500">
            <div className="text-3xl font-black text-amber-600 mb-1">{stats.pending}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</div>
          </div>
          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm border-l-4 border-l-red-500">
            <div className="text-3xl font-black text-red-600 mb-1">{stats.flagged}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flagged Content</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="flex-1 w-full relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product title or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm font-bold text-slate-600"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Info</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vendor</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Posted On</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Moderation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredListings.length > 0 ? filteredListings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                          <img
                            src={item.image || 'https://via.placeholder.com/150'}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{item.category?.name || (typeof item.category === 'string' ? item.category : 'Uncategorized')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-700">{item.vendor?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-slate-400">{item.vendor?.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-slate-900">Rs. {item.price}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center space-x-1.5 ${
                        item.status === 'active' ? 'bg-green-100 text-green-700' : 
                        item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'active' ? 'bg-green-500' : 
                          item.status === 'pending' ? 'bg-amber-500' : 
                          'bg-red-500'
                        }`} />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" 
                          title="Delete Product"
                        >
                          <Trash2Icon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400">
                      <PackageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-bold text-slate-900">No listings found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

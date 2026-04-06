import React, { useState, useEffect } from 'react'
import { 
  BanknoteIcon, 
  SearchIcon, 
  Loader2Icon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InfoIcon,
  UserIcon,
  BuildingIcon,
  CreditCardIcon
} from 'lucide-react'

export default function PayoutManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/payouts/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setRequests(data)
      } else {
        setError(data.message || 'Failed to fetch payout requests')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this request as ${status.toLowerCase()}?`)) return
    
    setProcessingId(id)
    try {
      const token = sessionStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/payouts/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.map(r => r._id === id ? { ...r, status } : r))
      } else {
        alert(data.message || 'Update failed')
      }
    } catch (err) {
      alert('Error updating status')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredRequests = requests.filter(r => {
    const vendorName = r.vendorId?.name?.toLowerCase() || ''
    const shopName = r.vendorId?.shopName?.toLowerCase() || ''
    const id = r._id?.toLowerCase() || ''
    return vendorName.includes(searchTerm.toLowerCase()) || 
           shopName.includes(searchTerm.toLowerCase()) || 
           id.includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 md:ml-64">
        <Loader2Icon className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2 text-center lg:text-left">Payout Requests</h1>
          <p className="text-gray-500 font-medium tracking-tight text-center lg:text-left">Review and process vendor payout requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-600">
              <InfoIcon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none mb-1">
              {requests.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pending Requests</div>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none mb-1">
              {requests.filter(r => r.status === 'Approved').length}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Processed Payouts</div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-600">
              <BanknoteIcon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-black text-gray-900 leading-none mb-1">
              Rs. {requests.reduce((sum, r) => sum + (r.status === 'Approved' ? r.amount : 0), 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Distributed</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-10 relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by vendor, shop name, or request ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border-0 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-red-50 transition-all font-medium text-gray-700 placeholder:text-gray-300"
          />
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden hover:shadow-premium transition-all group/card">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Vendor Info */}
                  <div className="lg:col-span-4 flex items-center space-x-5">
                    <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center text-gray-300 overflow-hidden ring-4 ring-gray-50 group-hover/card:ring-red-50 transition-all">
                      {request.vendorId?.shopLogo ? (
                        <img src={request.vendorId.shopLogo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-10 h-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">
                        {request.vendorId?.shopName || 'Unknown Shop'}
                      </h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                        {request.vendorId?.name || 'Unknown Vendor'}
                      </p>
                    </div>
                  </div>

                  {/* Amount & Bank Info */}
                  <div className="lg:col-span-1 lg:border-l lg:border-r border-gray-100 lg:px-8">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.15em] mb-1 text-center lg:text-left">Amount</p>
                    <p className="text-2xl font-black text-red-600 text-center lg:text-left">Rs.{request.amount}</p>
                  </div>

                  <div className="lg:col-span-4 lg:pl-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0">
                        <BuildingIcon className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800 leading-none mb-1">{request.bankDetails?.bankName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{request.bankDetails?.branch} Branch</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0">
                        <CreditCardIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800 leading-none mb-1">{request.bankDetails?.accountNumber}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{request.bankDetails?.accountName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center space-y-5">
                    <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                      request.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      request.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                    
                    {request.status === 'Pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Approved')}
                          disabled={processingId === request._id}
                          className="px-8 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:shadow-xl hover:shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'Rejected')}
                          disabled={processingId === request._id}
                          className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <BanknoteIcon className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-400 tracking-tight">No payout requests found</h3>
              <p className="text-gray-300 mt-2 font-medium">Try searching with a different term or check back later.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

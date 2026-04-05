import React, { useState, useEffect } from 'react'
import { 
  FlagIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  ClockIcon, 
  DollarSignIcon,
  SearchIcon,
  ChevronRightIcon
} from 'lucide-react'

export function Reports() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/payouts/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this payout?`)) return
    
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/payouts/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        // Update local state
        setRequests(requests.map(req => req._id === id ? { ...req, status } : req))
      }
    } catch (err) {
      console.error(err)
      alert('Error updating status')
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus
    const matchesSearch = req.vendorId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         req._id.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FlagIcon className="w-8 h-8 text-red-600" />
              Payout Reports
            </h1>
            <p className="text-slate-500 mt-1">Review and manage vendor payout requests</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search vendor or ID..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <select 
               className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
             </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <ClockIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                    {requests.filter(r => r.status === 'Pending').length}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Pending Requests</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <DollarSignIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                    Rs. {requests.filter(r => r.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Total Paid Out</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-600">
                        <FlagIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                    Rs. {requests.filter(r => r.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Pending Volume</div>
            </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vendor / ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Requested Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRequests.map((req) => (
                            <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                            {req.vendorId?.shopLogo ? (
                                              <img src={req.vendorId.shopLogo} className="w-full h-full object-cover" />
                                            ) : (
                                              <span className="font-bold">{req.vendorId?.shopName?.[0] || 'V'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{req.vendorId?.shopName || 'Unknown Vendor'}</div>
                                            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">#{req._id.substring(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-black text-slate-900">Rs. {req.amount.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-medium text-slate-500">{new Date(req.requestDate).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        req.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                        req.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {req.status === 'Pending' ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleUpdateStatus(req._id, 'Approved')}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                title="Approve Payout"
                                            >
                                                <CheckCircle2Icon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Reject Payout"
                                            >
                                                <XCircleIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                            Processed
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredRequests.length === 0 && (
                <div className="p-20 text-center">
                    <FlagIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No payout requests found.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import {
  DollarSignIcon,
  TrendingUpIcon,
  CreditCardIcon,
  SearchIcon,
  Loader2Icon,
  AlertCircleIcon
} from 'lucide-react'

export default function Payments() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/orders/admin/all-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setTransactions(data)
        } else {
          setError(data.message || 'Failed to fetch transactions')
        }
      } catch (err) {
        setError('Connection error: Could not reach the server')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const filteredTransactions = (transactions || []).filter(t => {
    const idMatch = t._id && String(t._id).toLowerCase().includes(searchTerm.toLowerCase());
    const userMatch = t.userId?.name && t.userId.name.toLowerCase().includes(searchTerm.toLowerCase());
    const vendorMatch = t.vendorId?.name && t.vendorId.name.toLowerCase().includes(searchTerm.toLowerCase());
    return idMatch || userMatch || vendorMatch;
  })

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0)
  const totalFees = transactions.reduce((sum, t) => sum + (t.commission || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2Icon className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 animate-pulse">Loading payment data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center">
          <AlertCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Payment Management
          </h1>
          <p className="text-gray-500">
            Monitor transactions, commissions, and overall revenue
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-xl">
                <DollarSignIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 font-medium">Total GMV</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-xl">
                <TrendingUpIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-500 font-medium">Platform Fees (5%)</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-50 flex items-center justify-center rounded-xl">
                <CreditCardIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
            <div className="text-sm text-gray-500 font-medium">Total Orders</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-4">
              <div className="w-12 h-12 bg-yellow-50 flex items-center justify-center rounded-xl">
                <DollarSignIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              Rs. {transactions.length > 0 ? (totalRevenue / transactions.length).toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-gray-500 font-medium">Avg. Order Value</div>
          </div>

        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID, Buyer, or Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 font-medium">
                        #{t._id.toString().slice(-8).toUpperCase()}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {t.userId?.name || 'Unknown User'}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {t.vendorId?.name || 'Unknown Vendor'}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        Rs. {t.totalAmount}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        Rs. {t.commission?.toFixed(2) || '0.00'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            t.paymentStatus === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : t.paymentStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {t.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                      <div className="flex flex-col items-center">
                        <SearchIcon className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="font-medium">No transactions found</p>
                      </div>
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
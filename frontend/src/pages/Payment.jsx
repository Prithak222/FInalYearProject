import React, { useState, useEffect } from 'react'
import { SearchIcon, DownloadIcon, EyeIcon, CreditCard, Calendar, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PaymentHistory() {
  const { isLoggedIn } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isLoggedIn) {
      fetchPaymentHistory()
    }
  }, [isLoggedIn])

  const fetchPaymentHistory = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/payments/payment-history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json() 
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments)
      }
    } catch (err) {
      console.error('Error fetching payment history:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = payments
    .reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = payments.filter((p) => {
    const transactionMatch = p.transactionUuid?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = p._id.toLowerCase().includes(searchTerm.toLowerCase());
    const itemMatch = p.orderIds?.some(order => 
      order.items?.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return transactionMatch || idMatch || itemMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-8">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              Payment History
            </h1>
            <p className="text-gray-500 font-medium">
              View and manage your transaction records and receipts
            </p>
          </div>
          <div className="bg-blue-600/10 p-3 rounded-2xl">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</div>
            <div className="text-3xl font-black text-gray-900">
              Rs. {totalSpent.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Success Payments</div>
            <div className="text-3xl font-black text-gray-900">
              {payments.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Last Transaction</div>
            <div className="text-lg font-bold text-gray-700">
              {payments.length > 0 ? new Date(payments[0].createdAt).toLocaleDateString() : 'No transactions'}
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Method
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => {
                    // Collect all items from all orders associated with this payment
                    const allItems = p.orderIds?.flatMap(order => order.items || []) || [];
                    const firstItem = allItems[0];

                    return (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">

                        <td className="px-6 py-5">
                          <div className="text-sm font-mono font-bold text-blue-600">
                            #{p.transactionUuid?.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium whitespace-nowrap">Ref: {p.transactionCode || 'N/A'}</div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 line-clamp-1">
                              {firstItem?.title || 'Multiple Items'}
                            </span>
                            {allItems.length > 1 && (
                              <span className="text-xs text-gray-500">+{allItems.length - 1} more items</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 font-black text-gray-900">
                          Rs. {p.amount.toLocaleString()}
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600 font-medium whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-green-100 text-green-700">
                            {p.paymentMethod}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              title="View Details"
                              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              title="Download Invoice"
                              className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            >
                              <DownloadIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No transactions found</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto mt-1">
                          You haven't made any successful payments yet. Start shopping to see history.
                        </p>
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

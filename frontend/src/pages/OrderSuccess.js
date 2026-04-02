import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, ShoppingBag, ArrowRight, Package } from 'lucide-react'

export function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId || 'N/A'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-32 pb-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">Thank You!</h1>
        <p className="text-slate-500 mb-8">Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
        
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
            <span className="text-sm font-mono font-bold text-slate-700">#{orderId.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">Pending</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/categories" 
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
          
          <Link 
             to="/profile" // Assuming orders are in profile page
             className="w-full py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <Package className="w-5 h-5" />
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

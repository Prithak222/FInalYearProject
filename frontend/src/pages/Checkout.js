import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, CreditCard, Truck, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function Checkout() {
  const { isLoggedIn, refreshCartCount } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('esewa')
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  })

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [isLoggedIn])

  const fetchCart = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setItems(data)
      } else {
        navigate('/cart') // Redirect if cart is empty
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const token = sessionStorage.getItem('token')
    const orderData = {
      shippingInfo: formData,
      items: items.map(item => ({
        productId: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        quantity: item.quantity,
        image: item.productId.image,
        vendorId: item.productId.vendor._id || item.productId.vendor
      })),
      totalAmount: items.reduce((sum, item) => sum + (item.productId?.price * item.quantity || 0), 0)
    }

    try {
      if (paymentMethod === 'esewa') {
        // Call eSewa initialization endpoint
        const res = await fetch('http://localhost:5000/api/payments/initialize-esewa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        const data = await res.json()
        if (data.success) {
          // Create a hidden form and submit it to eSewa
          const form = document.createElement('form');
          form.setAttribute('method', 'POST');
          form.setAttribute('action', data.gatewayUrl);

          for (const key in data.esewaData) {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', data.esewaData[key]);
            form.appendChild(hiddenField);
          }

          document.body.appendChild(form);
          form.submit();
        } else {
          showToast(data.message || 'Failed to initialize payment', 'error')
        }
      } else {
        // COD logic
        const res = await fetch('http://localhost:5000/api/payments/initialize-cod', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        const data = await res.json()
        if (data.success) {
          showToast('Order placed successfully!', 'success')
          refreshCartCount()
          navigate(`/order-success?transactionId=${data.transactionUuid}`)
        } else {
          showToast(data.message || 'Failed to place order', 'error')
        }
      }
    } catch (err) {
      console.error(err)
      showToast('Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.productId?.price * item.quantity || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back to Cart */}
        <Link to="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Shipping Details</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Shipping Address</label>
                    <textarea
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      placeholder="Enter your complete address"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer hover:bg-slate-50 transition-all ${paymentMethod === 'esewa' ? 'bg-blue-50/50 border-primary' : 'bg-white border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="esewa" 
                      checked={paymentMethod === 'esewa'} 
                      onChange={() => setPaymentMethod('esewa')}
                      className="w-5 h-5 text-primary focus:ring-primary" 
                    />
                    <div className="ml-4 flex items-center">
                      <img src="https://esewa.com.np/common/images/esewa-logo.png" alt="eSewa" className="h-8 mr-2" />
                      <span className="font-bold text-slate-800">eSewa Mobile Wallet</span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 rounded-xl border cursor-pointer hover:bg-slate-50 transition-all ${paymentMethod === 'cod' ? 'bg-blue-50/50 border-primary' : 'bg-white border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="w-5 h-5 text-primary focus:ring-primary" 
                    />
                    <div className="ml-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <ShoppingBag className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-bold text-slate-800">Cash on Delivery</span>
                    </div>
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{paymentMethod === 'esewa' ? 'Pay with eSewa' : 'Place Order (COD)'} (Rs. {totalPrice})</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6 scrollbar-thin">
                {items.map((item) => (
                  <div key={item._id} className="flex space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                      <img
                        src={item.productId?.image || 'https://via.placeholder.com/100'}
                        alt={item.productId?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.productId?.title}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">Rs. {item.productId?.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Calculated at next step</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-primary">Rs. {totalPrice}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed">
                  Your transaction is secure. We use advanced encryption to protect your data. By placing an order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

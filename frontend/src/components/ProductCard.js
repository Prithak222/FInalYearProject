import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HeartIcon, MapPinIcon, ShopIcon, CheckCircleIcon } from 'lucide-react'
import { ConditionBadge } from './ConditionBadge'
import { VerificationBadge } from './VerficationBadge'
import { useAuth } from '../context/AuthContext'

export function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted = false,
}) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const productUrl = `/product/${product._id}`
  const vendor = product.vendor || product.seller || {}

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] group flex flex-col h-full overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700">
      <Link
        to={productUrl}
        className="block relative aspect-[4/5] overflow-hidden bg-slate-50 sm:aspect-square md:aspect-[4/5]"
      >
        <img
          src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <ConditionBadge condition={product.condition} />
          {product.isNegotiable && (
            <span className="bg-black/80 backdrop-blur-md text-[9px] font-black px-3 py-1 rounded-full shadow-sm text-white uppercase tracking-widest">
              Negotiable
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault()
            if (!isLoggedIn) {
              navigate('/login', { state: { from: { pathname: productUrl } } })
              return
            }
            if (onWishlistToggle) {
              onWishlistToggle(product._id)
            }
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all active:scale-90 group/heart"
        >
          <HeartIcon
            className={`w-5 h-5 transition-colors ${isWishlisted
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-400 group-hover/heart:text-rose-500'
              }`}
          />
        </button>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <Link to={productUrl}>
            <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 hover:text-primary transition-colors pr-2 font-display">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-baseline space-x-2 mb-6">
          <span className="text-2xl font-black text-slate-900 font-display">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through font-medium">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden shadow-sm">
                {vendor.avatar ? (
                  <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  vendor.name?.charAt(0) || 'V'
                )}
              </div>
              {(vendor.isVendorApproved || vendor.verified) && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-primary fill-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-none">
                {vendor.name || 'Verified Vendor'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Member
              </span>
            </div>
          </div>
          
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            {product.category?.name || 'Item'}
          </span>
        </div>
      </div>
    </div>
  )
}


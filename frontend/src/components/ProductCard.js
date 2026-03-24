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
    <div className="card-human group flex flex-col h-full overflow-hidden">
      <Link
        to={productUrl}
        className="block relative aspect-[4/5] overflow-hidden bg-muted sm:aspect-square md:aspect-[4/5]"
      >
        <img
          src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <ConditionBadge condition={product.condition} />
          {product.isNegotiable && (
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-slate-200 text-slate-700 uppercase tracking-tight">
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
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-all active:scale-90 group/heart"
        >
          <HeartIcon
            className={`w-4.5 h-4.5 transition-colors ${isWishlisted
                ? 'fill-secondary text-secondary'
                : 'text-slate-400 group-hover/heart:text-secondary'
              }`}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-medium flex items-center gap-1.5">
            <MapPinIcon className="w-3 h-3" />
            {product.location || 'Nepal'}
          </p>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <Link to={productUrl} className="flex-1">
            <h3 className="text-base font-bold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors pr-2">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-xl font-display font-black text-foreground">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-rose-400/50">
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
             <span className="bg-muted px-2 py-0.5 rounded-full font-medium">
              {product.category?.name || product.category}
            </span>
            <span className="italic">
              {product.postedDate ? new Date(product.postedDate).toLocaleDateString() : 'Recently'}
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 overflow-hidden">
                {vendor.avatar ? (
                  <img src={vendor.avatar} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  vendor.name?.charAt(0) || 'V'
                )}
              </div>
              {(vendor.isVendorApproved || vendor.verified) && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircleIcon className="w-3 h-3 text-primary fill-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground leading-none">
                {vendor.name || 'Verified Vendor'}
              </span>
              <span className="text-[9px] text-muted-foreground">
                Shop Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'

export function ConditionBadge({ condition, size = 'sm' }) {
  const configs = {
    'New': {
      label: 'Brand New',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-100/80',
    },
    'Like New': {
      label: 'Like New',
      className: 'bg-blue-50 text-blue-700 border-blue-100/80',
    },
    'Good': {
      label: 'Used - Good',
      className: 'bg-orange-50 text-orange-700 border-orange-100/80',
    },
    'Fair': {
      label: 'Used - Fair',
      className: 'bg-slate-100 text-slate-700 border-slate-200/80',
    },
  }

  const config = configs[condition] || { 
    label: condition || 'Used', 
    className: 'bg-gray-50 text-gray-600 border-gray-100' 
  }

  const sizeClasses =
    size === 'sm' ? 'text-[10px] px-2 py-0.5 tracking-wide uppercase' : 'text-xs px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-md border font-bold shadow-sm ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  )
}

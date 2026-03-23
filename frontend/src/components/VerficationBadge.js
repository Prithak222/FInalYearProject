import React from 'react'
import { BadgeCheckIcon } from 'lucide-react'

export function VerificationBadge({ verified, size = 'sm' }) {
  if (!verified) return null

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div className="inline-flex items-center" title="Verified Seller">
      <BadgeCheckIcon className={`${iconSize} text-primary`} />
    </div>
  )
}

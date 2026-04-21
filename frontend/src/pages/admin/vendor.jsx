import React, { useState, useEffect } from 'react'
import {
  SearchIcon,
  FilterIcon,
  StoreIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  Trash2Icon,
} from 'lucide-react'

export function Vendors() {
  const [vendors, setVendors] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    // 📊 Fetch Stats
    fetch('http://localhost:5000/auth/admin/vendors/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))

    // 📦 Fetch All Vendors
    fetch('http://localhost:5000/auth/admin/vendors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data) => {
        setVendors(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this vendor? All their products will also be deleted.')) {
      return
    }

    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/auth/admin/vendors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setVendors(vendors.filter(v => v._id !== id))
        // Refresh stats
        const statsRes = await fetch('http://localhost:5000/auth/admin/vendors/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (statsRes.ok) {
          const sData = await statsRes.json()
          setStats(sData)
        }
      } else {
        const err = await res.json()
        alert(err.message || 'Failed to remove vendor')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  return (
    // ⬇️ padding-top prevents navbar overlap
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
      <div className="px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage platform vendors and shops
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-accent">
            <FilterIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Stat title="Total Vendors" value={loading ? "..." : stats.total} />
          <Stat title="Verified" value={loading ? "..." : stats.verified} color="text-green-600" />
          <Stat title="Pending" value={loading ? "..." : stats.pending} color="text-amber-600" />
          <Stat title="Rejected" value={loading ? "..." : stats.rejected} color="text-red-600" />
        </div>

        {/* Vendors Table */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted border-b sticky top-0 z-10">
                <tr>
                  <TableHead>Shop</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </tr>
              </thead>

              <tbody className="divide-y">
                {Array.isArray(vendors) && vendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-accent">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <StoreIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">{vendor.name}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={vendor.isVendorApproved ? 'verified' : 'pending'} />
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteVendor(vendor._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Vendor"
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

/* ------------------ Helper Components ------------------ */

function Stat({ title, value, color = 'text-foreground' }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className={`text-2xl font-bold mb-1 ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  )
}

function TableHead({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
      {children}
    </th>
  )
}

function StatusBadge({ status }) {
  if (status === 'verified') {
    return (
      <Badge className="bg-green-100 text-green-700">
        <CheckCircleIcon className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    )
  }

  if (status === 'pending') {
    return (
      <Badge className="bg-amber-100 text-amber-700">
        <ClockIcon className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }

  return (
    <Badge className="bg-red-100 text-red-700">
      <XCircleIcon className="w-3 h-3 mr-1" />
      Rejected
    </Badge>
  )
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}


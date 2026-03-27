import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  UsersIcon,
  StoreIcon,
  PackageIcon,
  DollarSignIcon,

  ClockIcon,
} from 'lucide-react'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [pendingVendors, setPendingVendors] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeVendors: 0,
    totalProducts: 0,
    gmv: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    // 📊 Fetch stats
    fetch('http://localhost:5000/auth/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoadingStats(false)
      })
      .catch((err) => {
        console.error(err)
        setLoadingStats(false)
      })

    // 📦 Fetch pending vendors
    fetch('http://localhost:5000/auth/admin/vendors/pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPendingVendors(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
  }, [navigate])

  const handleApprove = async (vendorId) => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/auth/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setPendingVendors(pendingVendors.filter((v) => v._id !== vendorId))
        // Refresh stats after approval
        const statsRes = await fetch('http://localhost:5000/auth/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const statsData = await statsRes.json()
        setStats(statsData)
      } else {
        alert("Failed to approve")
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecline = async (vendorId) => {
    const token = sessionStorage.getItem('token')
    if (!window.confirm("Are you sure you want to decline and remove this vendor?")) return;

    try {
      const res = await fetch(`http://localhost:5000/auth/admin/vendors/${vendorId}/decline`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setPendingVendors(pendingVendors.filter((v) => v._id !== vendorId))
      } else {
        alert("Failed to decline")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
      <div className="px-6 py-8">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Platform overview and management
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Stat
            icon={<UsersIcon />}
            title="Total Users"
            value={loadingStats ? "..." : stats.totalUsers}
          />
          <Stat
            icon={<StoreIcon />}
            title="Active Vendors"
            value={loadingStats ? "..." : stats.activeVendors}
          />
          <Stat
            icon={<PackageIcon />}
            title="Listings"
            value={loadingStats ? "..." : stats.totalProducts}
          />
          <Stat
            icon={<DollarSignIcon />}
            title="GMV"
            value={loadingStats ? "..." : `$${stats.gmv}`}
          />
        </div>

        {/* Vendors */}
        <div className="bg-white border rounded-lg">
          <div className="p-6 border-b flex justify-between">
            <h2 className="text-lg font-semibold">Pending Vendors</h2>
            <Link to="/admin/vendors" className="text-primary">
              View all →
            </Link>
          </div>

          <div className="divide-y">
            {pendingVendors.length === 0 && (
              <p className="p-6 text-muted-foreground">
                No pending vendors 🎉
              </p>
            )}

            {Array.isArray(pendingVendors) && pendingVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <StoreIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {vendor.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full mr-2">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                  <button
                    onClick={() => handleApprove(vendor._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(vendor._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, title, value }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  )
}

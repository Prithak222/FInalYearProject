import React, { useState, useEffect } from 'react'
import {
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  BanIcon,
  CheckCircleIcon,
} from 'lucide-react'

export function Users() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0
  })
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState(null)

  const fetchData = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) return

    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3000/auth/admin/users/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:3000/auth/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const statsData = await statsRes.json()
      const usersData = await usersRes.json()

      setStats(statsData)
      setUsers(Array.isArray(usersData) ? usersData : [])
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSuspend = async (userId) => {
    const token = sessionStorage.getItem('token')
    if (!window.confirm("Suspend this user for 24 hours?")) return

    try {
      const res = await fetch(`http://localhost:3000/auth/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setOpenMenuId(null)
        fetchData()
      } else {
        alert("Failed to suspend user")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    // 🔥 IMPORTANT: pushes content right for admin sidebar
    <div className="min-h-screen bg-background pb-20 md:pb-8 md:ml-64">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage platform users
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button className="flex items-center space-x-2 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors">
            <FilterIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-foreground">{loading ? "..." : stats.total}</div>
            <div className="text-sm text-muted-foreground">
              Total Users
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-green-600">{loading ? "..." : stats.active}</div>
            <div className="text-sm text-muted-foreground">
              Active
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-4">
            <div className="text-2xl font-bold text-red-600">{loading ? "..." : stats.suspended}</div>
            <div className="text-sm text-muted-foreground">
              Suspended
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {Array.isArray(users) && users.map((user) => {
                  const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date()

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-accent transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">
                          {user.name}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSuspended
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {isSuspended ? (
                            <>
                              <BanIcon className="w-3 h-3 mr-1" />
                              Suspended
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Active
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                          className="p-2 hover:bg-accent rounded-lg"
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>

                        {openMenuId === user._id && (
                          <div className="absolute right-6 top-10 w-48 bg-white border border-border rounded-lg shadow-lg z-10 py-1">
                            <button
                              disabled={isSuspended}
                              onClick={() => handleSuspend(user._id)}
                              className={`w-full flex items-center space-x-2 px-4 py-2 text-sm text-left hover:bg-accent ${isSuspended ? 'opacity-50 cursor-not-allowed' : 'text-red-600'
                                }`}
                            >
                              <BanIcon className="w-4 h-4" />
                              <span>Suspend for 24h</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">
                      No users found
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

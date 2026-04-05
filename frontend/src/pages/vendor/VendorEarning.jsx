import React, { useState } from 'react'
import { DollarSignIcon, TrendingUpIcon, DownloadIcon, CalendarIcon } from 'lucide-react'

export default function VendorEarnings() {
  const [earnings, setEarnings] = useState([])
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const fetchEarnings = async () => {
      const token = sessionStorage.getItem('token')
      try {
        const res = await fetch('http://localhost:5000/api/orders/vendor-orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setEarnings(data || [])
        }
      } catch (err) {
        console.error('Error fetching vendor earnings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEarnings()
  }, [])

  const handleRequestPayout = async () => {
    if (pendingEarnings <= 0) {
      alert('No pending earnings available for payout.')
      return
    }

    const bankInfo = prompt('Please enter your Bank Details (Name, A/C No, Bank Name):')
    if (!bankInfo) return

    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/payouts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: pendingEarnings,
          bankDetails: {
            bankName: bankInfo // Simplified for now
          }
        })
      })

      if (res.ok) {
        alert('Payout request submitted successfully!')
        // Refresh data or update local state
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.message || 'Failed to submit request')
      }
    } catch (err) {
      console.error(err)
      alert('Server error')
    }
  }

  const totalEarnings = earnings.reduce((sum, e) => sum + (e.vendorEarning || 0), 0)
  const paidEarnings = earnings
    .filter((e) => e.paymentStatus === 'Completed')
    .reduce((sum, e) => sum + (e.vendorEarning || 0), 0)
  const pendingEarnings = earnings
    .filter((e) => e.paymentStatus === 'Pending')
    .reduce((sum, e) => sum + (e.vendorEarning || 0), 0)
  const avgPerSale = earnings.length > 0 ? totalEarnings / earnings.length : 0

  const stats = [
    {
      label: 'Total Earnings',
      value: `Rs. ${totalEarnings.toLocaleString()}`,
      badge: null,
      icon: DollarSignIcon,
      color: '#22c55e',
      bg: '#f0fdf4',
    },
    {
      label: 'Completed Sales',
      value: `Rs. ${paidEarnings.toLocaleString()}`,
      badge: null,
      icon: TrendingUpIcon,
      color: '#3b82f6',
      bg: '#eff6ff',
    },
    {
      label: 'Pending Payouts',
      value: `Rs. ${pendingEarnings.toLocaleString()}`,
      badge: null,
      icon: CalendarIcon,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Avg per Sale',
      value: `Rs. ${avgPerSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      badge: null,
      icon: DollarSignIcon,
      color: '#a855f7',
      bg: '#faf5ff',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ve-root {
          min-height: 100vh;
          background: #fafaf8;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .ve-root {
            margin-left: 16rem; /* md:ml-64 */
          }
        }

        .ve-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        /* Header */
        .ve-header {
          margin-bottom: 40px;
          border-left: 3px solid #111;
          padding-left: 16px;
        }
        .ve-header h1 {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .ve-header p {
          margin-top: 6px;
          font-size: 0.875rem;
          color: #888;
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        /* Stats Grid */
        .ve-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 768px) {
          .ve-stats { grid-template-columns: repeat(2, 1fr); }
          .ve-header h1 { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .ve-stats { grid-template-columns: 1fr; }
        }

        .ve-stat-card {
          background: #fff;
          border: 1px solid #e8e8e4;
          border-radius: 12px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ve-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.07);
        }
        .ve-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .ve-stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ve-stat-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 500;
          color: #22c55e;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .ve-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .ve-stat-label {
          font-size: 0.78rem;
          color: #999;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Payout Banner */
        .ve-payout {
          background: #111;
          border-radius: 12px;
          padding: 22px 28px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        @media (max-width: 540px) {
          .ve-payout { flex-direction: column; align-items: flex-start; }
        }
        .ve-payout-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .ve-payout-sub {
          font-size: 0.8rem;
          color: #888;
        }
        .ve-payout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: #fff;
          color: #111;
          border: none;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, transform 0.12s;
          flex-shrink: 0;
        }
        .ve-payout-btn:hover {
          background: #e8e8e4;
          transform: scale(1.02);
        }

        /* Table */
        .ve-table-card {
          background: #fff;
          border: 1px solid #e8e8e4;
          border-radius: 12px;
          overflow: hidden;
        }
        .ve-table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e8e8e4;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ve-table-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.01em;
        }
        .ve-table-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }
        .ve-table-wrap {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        thead tr {
          background: #fafaf8;
          border-bottom: 1px solid #e8e8e4;
        }
        th {
          padding: 10px 20px;
          text-align: left;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        tbody tr {
          border-bottom: 1px solid #f0f0ed;
          transition: background 0.12s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafaf8; }
        td {
          padding: 14px 20px;
          font-size: 0.85rem;
          color: #444;
          vertical-align: middle;
          white-space: nowrap;
        }
        .td-order {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }
        .td-product {
          font-weight: 500;
          color: #111;
        }
        .td-buyer { color: #666; }
        .td-amount { font-weight: 500; color: #111; }
        .td-fee { color: #bbb; }
        .td-net {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #16a34a;
        }
        .td-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #bbb;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .badge-paid {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }
        .badge-pending {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }
      `}</style>

      <div className="ve-root">
        <div className="ve-inner">

          {/* Header */}
          <div className="ve-header">
            <h1>Earnings</h1>
            <p>Track your sales and revenue</p>
          </div>

          {/* Stats */}
          <div className="ve-stats">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div className="ve-stat-card" key={s.label}>
                  <div className="ve-stat-top">
                    <div className="ve-stat-icon" style={{ background: s.bg }}>
                      <Icon size={18} color={s.color} strokeWidth={2} />
                    </div>
                    {s.badge && <span className="ve-stat-badge">{s.badge}</span>}
                  </div>
                  <div className="ve-stat-value">{s.value}</div>
                  <div className="ve-stat-label">{s.label}</div>
                </div>
              )
            })}
          </div>

          {/* Payout Banner */}
          <div className="ve-payout">
            <div>
              <div className="ve-payout-title">Available for Payout</div>
              <div className="ve-payout-sub">Request a payout to your bank account</div>
            </div>
            <button className="ve-payout-btn" onClick={handleRequestPayout}>
              <DownloadIcon size={15} strokeWidth={2.5} />
              Request Payout
            </button>
          </div>

          {/* Table */}
          <div className="ve-table-card">
            <div className="ve-table-header">
              <h2>Transaction History</h2>
              <span className="ve-table-count">{earnings.length} records</span>
            </div>
            <div className="ve-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Net</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((order) => (
                    <tr key={order._id}>
                      <td className="td-order">{order._id.substring(0, 8)}...</td>
                      <td className="td-product">
                        {order.items?.length > 1 
                          ? `${order.items[0].title} +${order.items.length - 1}` 
                          : order.items?.[0]?.title || 'Multiple Items'}
                      </td>
                      <td className="td-buyer">{order.shippingInfo?.name || 'Customer'}</td>
                      <td className="td-amount">Rs. {order.totalAmount.toLocaleString()}</td>
                      <td className="td-fee">−Rs. {order.commission.toLocaleString()}</td>
                      <td className="td-net">Rs. {order.vendorEarning.toLocaleString()}</td>
                      <td className="td-date">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${order.paymentStatus === 'Completed' ? 'badge-paid' : 'badge-pending'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {earnings.length === 0 && !loading && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        No transactions found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
import React, { useState, useEffect } from 'react'
import { 
  FlagIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  SearchIcon,
  AlertCircleIcon,
  UserIcon,
  MessageSquareIcon,
  CalendarIcon
} from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/reports/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      }
    } catch (err) {
      console.error(err)
      showToast('Error fetching reports', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Mark this report as ${status}?`)) return
    
    const token = sessionStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/reports/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setReports(reports.map(r => r._id === id ? { ...r, status } : r))
        showToast(`Report marked as ${status}`, 'success')
      }
    } catch (err) {
      console.error(err)
      showToast('Error updating status', 'error')
    }
  }

  const filteredReports = reports.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus
    const matchesSearch = r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 md:ml-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-black text-slate-900 flex items-center gap-2">
              <FlagIcon className="w-8 h-8 text-red-600" />
               Customer Reports
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Review and resolve customer complaints and issues</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search subject or description..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <select 
               className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none"
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
             </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 w-12 h-12 flex items-center justify-center mb-4">
                    <ClockIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                    {reports.filter(r => r.status === 'Pending').length}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Issues</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 w-12 h-12 flex items-center justify-center mb-4">
                    <AlertCircleIcon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                    {reports.filter(r => r.status === 'In Progress').length}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Progress</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 w-12 h-12 flex items-center justify-center mb-4">
                    <CheckCircle2Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">
                    {reports.filter(r => r.status === 'Resolved').length}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resolved Cases</div>
            </div>
        </div>

        {/* Reports Feed */}
        <div className="space-y-6">
            {filteredReports.map((report) => (
                <div key={report._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            
                            {/* User Info Column */}
                            <div className="lg:w-1/4 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100 shadow-sm">
                                    {report.userId?.image ? (
                                        <img src={report.userId.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-6 h-6 text-slate-300" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-slate-900 truncate">{report.userId?.name || 'Deleted User'}</h3>
                                    <p className="text-xs text-slate-400 truncate font-medium">{report.userId?.email}</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mt-3 ${
                                        report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' :
                                        report.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            report.status === 'Resolved' ? 'bg-emerald-500' :
                                            report.status === 'In Progress' ? 'bg-indigo-500' :
                                            'bg-amber-500'
                                        }`} />
                                        {report.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquareIcon className="w-4 h-4 text-slate-300" />
                                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{report.subject}</h4>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {report.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-3 h-3" />
                                        {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <span>•</span>
                                    <div>Report ID: #{report._id.substring(0, 8)}</div>
                                </div>
                            </div>

                            {/* Actions Column */}
                            <div className="lg:w-48 flex flex-col gap-2">
                                {report.status !== 'Resolved' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                                        className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                                    >
                                        Resolve
                                    </button>
                                )}
                                {report.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(report._id, 'In Progress')}
                                        className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        Mark Progress
                                    </button>
                                )}
                                {report.status === 'Resolved' && (
                                    <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Resolved Case
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            ))}

            {filteredReports.length === 0 && (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center">
                    <MessageSquareIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">No reports found.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  )
}

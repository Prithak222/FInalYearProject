import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircleIcon, XCircleIcon, InfoIcon, AlertTriangleIcon, XIcon } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500" />,
    info: <InfoIcon className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangleIcon className="w-5 h-5 text-amber-500" />,
  }

  const bgColors = {
    success: 'bg-white border-emerald-100',
    error: 'bg-white border-red-100',
    info: 'bg-white border-blue-100',
    warning: 'bg-white border-amber-100',
  }

  return (
    <div className={`
      pointer-events-auto
      flex items-center gap-3 p-4 pr-10 rounded-2xl border shadow-premium
      animate-in slide-in-from-right fade-in duration-300
      ${bgColors[toast.type] || 'bg-white border-slate-100'}
      min-w-[300px] relative overflow-hidden group
    `}>
      <div className="flex-shrink-0">
        {icons[toast.type] || icons.info}
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800 leading-tight">
          {toast.message}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
      >
        <XIcon className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div className={`
        absolute bottom-0 left-0 h-1 bg-current opacity-20
        animate-progress-shrink origin-left
      `} style={{ width: '100%' }}></div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

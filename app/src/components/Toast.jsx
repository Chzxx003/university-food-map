import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { CheckCircle, Heart, ThumbsUp, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle,
  favorite: Heart,
  like: ThumbsUp,
  error: AlertCircle,
}

const borderColors = {
  success: 'border-l-3 border-green-400',
  favorite: 'border-l-3 border-primary',
  like: 'border-l-3 border-blue-400',
  error: 'border-l-3 border-red-400',
}

const iconColors = {
  success: 'text-green-500',
  favorite: 'text-primary',
  like: 'text-blue-500',
  error: 'text-red-500',
}

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false)
  const Icon = icons[toast.type] || icons.success

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), toast.duration - 300)
    const removeTimer = setTimeout(() => onRemove(toast.id), toast.duration)
    return () => { clearTimeout(timer); clearTimeout(removeTimer) }
  }, [toast, onRemove])

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 glass-strong rounded-2xl text-text text-sm font-medium shadow-lg ${borderColors[toast.type] || borderColors.success} transition-all duration-300 ${exiting ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
      style={{ animation: exiting ? undefined : 'toast-in 0.3s ease-out' }}
    >
      <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${iconColors[toast.type] || iconColors.success} ${toast.type === 'favorite' ? 'fill-primary' : ''}`} />
      <span>{toast.message}</span>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', duration = 2000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* Toast container */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

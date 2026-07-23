'use client'

import { Toast as ToastType } from './ToastContext'
import { useEffect, useState } from 'react'

interface ToastProps {
  toast: ToastType
  onClose: () => void
}

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    if (toast.duration === 0) return

    const timer = setTimeout(handleClose, (toast.duration ?? 3000) + 500)
    return () => clearTimeout(timer)
  }, [toast.duration])

  return (
    <div
      className={`${colors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      role="alert"
    >
      <span className="font-bold text-lg w-6 text-center flex-shrink-0">
        {icons[toast.type]}
      </span>
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={handleClose}
        className="ml-2 text-white hover:opacity-80 flex-shrink-0"
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  )
}

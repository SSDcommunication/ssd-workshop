'use client'

import { ToastProvider } from '@/components/ui/Toast/ToastContext'
import ToastContainer from '@/components/ui/Toast/ToastContainer'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}

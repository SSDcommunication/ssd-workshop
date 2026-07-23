'use client'

import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  isDangerous?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-2xl p-6 max-w-sm w-full backdrop:bg-black/50"
      onKeyDown={handleKeyDown}
    >
      <h2 className="font-bold text-lg text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 rounded text-white disabled:opacity-50 ${
            isDangerous
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#4dd1e3] hover:opacity-90'
          }`}
        >
          {isLoading ? 'Traitement...' : 'Confirmer'}
        </button>
      </div>
    </dialog>
  )
}

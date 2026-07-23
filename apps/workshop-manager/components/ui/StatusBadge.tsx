'use client'

import clsx from 'clsx'

interface StatusBadgeProps {
  status: string
  variant?: 'workshop-type' | 'workshop'
}

export default function StatusBadge({ status, variant = 'workshop-type' }: StatusBadgeProps) {
  const statusConfig = {
    // Workshop Type statuses
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivé' },
    draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Brouillon' },
    // Workshop statuses
    'en-construction': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En construction' },
    'en-attente': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En attente' },
    confirme: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmé' },
    annule: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulé' },
  } as const

  type StatusKey = keyof typeof statusConfig
  const config = statusConfig[status.toLowerCase() as StatusKey] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status,
  }

  return (
    <span className={clsx('px-2 py-1 rounded-full text-sm font-medium', config.bg, config.text)}>
      {config.label}
    </span>
  )
}

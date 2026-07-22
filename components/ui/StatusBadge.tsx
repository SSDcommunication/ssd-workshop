'use client'

interface StatusBadgeProps {
  status: string
  type?: 'workshop_type' | 'workshop'
}

const statusConfig: Record<string, Record<string, { bg: string; text: string; label: string }>> = {
  workshop_type: {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivé' },
  },
  workshop: {
    planning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En construction' },
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Terminé' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archivé' },
  },
}

export default function StatusBadge({ status, type = 'workshop' }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status]

  if (!config) {
    return null
  }

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

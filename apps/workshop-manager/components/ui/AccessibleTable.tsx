'use client'

import React from 'react'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
}

interface AccessibleTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  caption?: string
  loading?: boolean
  emptyMessage?: string
  ariaLabel?: string
}

export default function AccessibleTable<T extends { id: string }>({
  columns,
  data,
  caption,
  loading = false,
  emptyMessage = 'Aucune donnée',
  ariaLabel,
}: AccessibleTableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <p className="text-gray-500">Chargement...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8" role="status">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-left"
        role="table"
        aria-label={ariaLabel}
      >
        {caption && (
          <caption className="sr-only text-left text-sm text-gray-600">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 text-sm font-semibold text-gray-900"
                role="columnheader"
                aria-sort={col.sortable ? 'none' : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              role="row"
            >
              {columns.map((col) => (
                <td
                  key={`${item.id}-${String(col.key)}`}
                  className="px-4 py-3 text-sm text-gray-700"
                  role="cell"
                >
                  {col.render
                    ? col.render(item[col.key as keyof T], item)
                    : String(item[col.key as keyof T] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

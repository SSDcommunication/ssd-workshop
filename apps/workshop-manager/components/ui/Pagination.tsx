'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)

  let startPage = Math.max(1, page - halfVisible)
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) pages.push('...')
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || disabled}
        className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page précédente"
      >
        ← Précédent
      </button>

      <div className="flex gap-1">
        {pages.map((p, i) => (
          <div key={`${p}-${i}`}>
            {p === '...' ? (
              <span className="px-2 py-1 text-gray-500">…</span>
            ) : (
              <button
                onClick={() => onPageChange(p as number)}
                disabled={disabled}
                className={`px-3 py-1 rounded text-sm border ${
                  p === page
                    ? 'bg-[#4dd1e3] text-white border-[#4dd1e3]'
                    : 'border-gray-300 hover:border-[#4dd1e3]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={`Aller à la page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || disabled}
        className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Page suivante"
      >
        Suivant →
      </button>

      <span className="ml-2 text-sm text-gray-600">
        Page {page} / {totalPages}
      </span>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Workshop } from '@/types'

const ITEMS_PER_PAGE = 20
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const SEARCH_DEBOUNCE = 300

export function useWorkshopsAdvanced() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const [search, setSearch] = useState('')
  const [workshopTypeFilter, setWorkshopTypeFilter] = useState('')

  const cacheRef = useRef<{
    data: Workshop[]
    search: string
    workshopTypeFilter: string
    page: number
    timestamp: number
    totalPages: number
    totalItems: number
  } | null>(null)

  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const fetchWorkshops = useCallback(
    async (
      pageNum = 1,
      searchTerm = '',
      typeFilter = '',
      skipCache = false
    ): Promise<void> => {
      const now = Date.now()

      if (
        !skipCache &&
        cacheRef.current &&
        cacheRef.current.search === searchTerm &&
        cacheRef.current.workshopTypeFilter === typeFilter &&
        cacheRef.current.page === pageNum &&
        now - cacheRef.current.timestamp < CACHE_DURATION
      ) {
        setWorkshops(cacheRef.current.data)
        setTotalPages(cacheRef.current.totalPages)
        setTotalItems(cacheRef.current.totalItems)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set('page', String(pageNum))
        params.set('limit', String(ITEMS_PER_PAGE))
        if (searchTerm) params.set('search', searchTerm)
        if (typeFilter) params.set('workshop_type_id', typeFilter)

        const response = await fetch(`/api/workshops?${params}`)
        if (!response.ok) throw new Error('Erreur lors du chargement')

        const data = await response.json()
        setWorkshops(data.items)
        setTotalPages(data.totalPages)
        setTotalItems(data.totalItems)

        cacheRef.current = {
          data: data.items,
          search: searchTerm,
          workshopTypeFilter: typeFilter,
          page: pageNum,
          timestamp: now,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchWorkshops(1, '', '', true).finally(() => setIsInitialized(true))
  }, [])

  const handleSearchChange = (term: string) => {
    setSearch(term)
    setPage(1)

    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      fetchWorkshops(1, term, workshopTypeFilter)
    }, SEARCH_DEBOUNCE)
  }

  const handleFilterChange = (typeId: string) => {
    setWorkshopTypeFilter(typeId)
    setPage(1)
    fetchWorkshops(1, search, typeId)
  }

  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return
    setPage(pageNum)
    fetchWorkshops(pageNum, search, workshopTypeFilter)
  }

  const addWorkshop = async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshop),
      })
      if (!res.ok) throw new Error('Erreur lors de l\'ajout')
      const newWorkshop = await res.json()

      setWorkshops((prev) => [newWorkshop, ...prev])
      setTotalItems((prev) => prev + 1)
      return newWorkshop
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      throw err
    }
  }

  const updateWorkshop = async (id: string, updates: Partial<Workshop>) => {
    try {
      const res = await fetch(`/api/workshops/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      const updated = await res.json()
      setWorkshops((prev) => prev.map((w) => (w.id === id ? updated : w)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      throw err
    }
  }

  const deleteWorkshop = async (id: string) => {
    try {
      const res = await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      setWorkshops((prev) => prev.filter((w) => w.id !== id))
      setTotalItems((prev) => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
      throw err
    }
  }

  const refetch = () => fetchWorkshops(page, search, workshopTypeFilter, true)

  return {
    workshops,
    loading,
    error,
    isInitialized,
    page,
    totalPages,
    totalItems,
    search,
    workshopTypeFilter,
    setSearch: handleSearchChange,
    setWorkshopTypeFilter: handleFilterChange,
    goToPage,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    refetch,
    itemsPerPage: ITEMS_PER_PAGE,
  }
}

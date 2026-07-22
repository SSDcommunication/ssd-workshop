'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { WorkshopType } from '@/types'

const ITEMS_PER_PAGE = 20
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const SEARCH_DEBOUNCE = 300

export function useWorkshopTypesAdvanced() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const [search, setSearch] = useState('')

  const cacheRef = useRef<{
    data: WorkshopType[]
    search: string
    page: number
    timestamp: number
    totalPages: number
    totalItems: number
  } | null>(null)

  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  const fetchTypes = useCallback(
    async (pageNum = 1, searchTerm = '', skipCache = false): Promise<void> => {
      const now = Date.now()
      const cacheKey = `${searchTerm}:${pageNum}`

      if (
        !skipCache &&
        cacheRef.current &&
        cacheRef.current.search === searchTerm &&
        cacheRef.current.page === pageNum &&
        now - cacheRef.current.timestamp < CACHE_DURATION
      ) {
        setTypes(cacheRef.current.data)
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

        const response = await fetch(`/api/workshop-types?${params}`)
        if (!response.ok) throw new Error('Erreur lors du chargement')

        const data = await response.json()
        setTypes(data.items)
        setTotalPages(data.totalPages)
        setTotalItems(data.totalItems)

        cacheRef.current = {
          data: data.items,
          search: searchTerm,
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
    fetchTypes(1, '', true).finally(() => setIsInitialized(true))
  }, [])

  const handleSearchChange = (term: string) => {
    setSearch(term)
    setPage(1)

    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      fetchTypes(1, term)
    }, SEARCH_DEBOUNCE)
  }

  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return
    setPage(pageNum)
    fetchTypes(pageNum, search)
  }

  const refetch = () => fetchTypes(page, search, true)

  return {
    types,
    loading,
    error,
    isInitialized,
    page,
    totalPages,
    totalItems,
    search,
    setSearch: handleSearchChange,
    goToPage,
    refetch,
    itemsPerPage: ITEMS_PER_PAGE,
  }
}

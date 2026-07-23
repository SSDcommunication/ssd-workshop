'use client'

import { useState, useEffect } from 'react'
import { WorkshopType } from '@/types'

export function useWorkshopTypes() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchTypes = async () => {
      try {
        console.log('[useWorkshopTypes] Starting fetch...')
        const response = await fetch('/api/workshop-types?page=1&limit=1000')
        console.log('[useWorkshopTypes] Response status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        console.log('[useWorkshopTypes] Got data:', result.items?.length || 0, 'items')

        if (!isMounted) return

        if (result.items && Array.isArray(result.items)) {
          setTypes(result.items)
        }
        setError(null)
      } catch (err) {
        console.error('[useWorkshopTypes] Fetch error:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setIsInitialized(true)
        }
      }
    }

    fetchTypes()

    return () => {
      isMounted = false
    }
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/workshop-types?page=1&limit=1000')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      if (result.items && Array.isArray(result.items)) {
        setTypes(result.items)
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const addType = async (type: Omit<WorkshopType, 'id'>) => {
    try {
      const response = await fetch('/api/workshop-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(type),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
      const newType = await response.json()
      setTypes([...types, newType])
    } catch (err) {
      throw err
    }
  }

  const updateType = async (id: string, updates: Partial<WorkshopType>) => {
    try {
      const response = await fetch(`/api/workshop-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      const updated = await response.json()
      setTypes(types.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      throw err
    }
  }

  const deleteType = async (id: string) => {
    try {
      const response = await fetch(`/api/workshop-types/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      setTypes(types.filter((t) => t.id !== id))
    } catch (err) {
      throw err
    }
  }

  return { types, loading, error, addType, updateType, deleteType, refetch }
}

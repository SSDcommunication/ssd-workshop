'use client'

import { useState, useEffect, useCallback } from 'react'
import { WorkshopType } from '@/types'

export function useWorkshopTypes() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const response = await fetch('/api/workshop-types?page=1&limit=1000', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()

        if (mounted) {
          setTypes(Array.isArray(data.items) ? data.items : [])
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          console.error('Hook error:', err)
          setError(err instanceof Error ? err.message : 'Erreur')
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/workshop-types?page=1&limit=1000')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setTypes(Array.isArray(data.items) ? data.items : [])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const addType = useCallback(async (type: Omit<WorkshopType, 'id'>) => {
    try {
      const response = await fetch('/api/workshop-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(type),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
      const newType = await response.json()
      setTypes((prevTypes) => [...prevTypes, newType])
      return newType
    } catch (err) {
      throw err
    }
  }, [])

  const updateType = useCallback(async (id: string, updates: Partial<WorkshopType>) => {
    try {
      const response = await fetch(`/api/workshop-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      const updated = await response.json()
      setTypes((prevTypes) => prevTypes.map((t) => (t.id === id ? updated : t)))
      return updated
    } catch (err) {
      throw err
    }
  }, [])

  const deleteType = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/workshop-types/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      setTypes((prevTypes) => prevTypes.filter((t) => t.id !== id))
    } catch (err) {
      throw err
    }
  }, [])

  return { types, loading, error, addType, updateType, deleteType, refetch, isInitialized: !loading }
}

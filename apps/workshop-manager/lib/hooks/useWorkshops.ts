import { useState, useEffect, useCallback } from 'react'
import { Workshop } from '@/types'

export function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchWorkshops = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/workshops?page=1&limit=1000')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const result = await res.json()
      const data = result.items || result
      setWorkshops(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkshops().finally(() => setIsInitialized(true))
  }, [fetchWorkshops])

  const addWorkshop = useCallback(async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshop),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to add workshop (HTTP ${res.status})`)
      }
      const newWorkshop = await res.json()
      setWorkshops((prev) => [...prev, newWorkshop])
      return newWorkshop
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    }
  }, [])

  const updateWorkshop = useCallback(async (id: string, updates: Partial<Workshop>) => {
    try {
      const res = await fetch(`/api/workshops/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update workshop')
      const updated = await res.json()
      setWorkshops((prev) => prev.map((w) => (w.id === id ? updated : w)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  const deleteWorkshop = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete workshop')
      setWorkshops((prev) => prev.filter((w) => w.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }, [])

  return {
    workshops,
    loading,
    error,
    isInitialized,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    refetch: fetchWorkshops,
  }
}

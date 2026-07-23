'use client'

import { useState, useEffect } from 'react'
import { WorkshopType } from '@/types'

export function useWorkshopTypes() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchTypes = async (): Promise<void> => {
    try {
      console.log('[useWorkshopTypes] Starting fetch...')
      setLoading(true)
      setError(null)
      const response = await fetch('/api/workshop-types?page=1&limit=1000', { method: 'GET' })
      console.log('[useWorkshopTypes] Response status:', response.status, response.ok)
      if (!response.ok) throw new Error(`HTTP ${response.status}: Erreur lors du chargement`)
      const result = await response.json()
      console.log('[useWorkshopTypes] Raw API response:', result)
      const data = result.items || result
      console.log('[useWorkshopTypes] Extracted data:', data)
      console.log('[useWorkshopTypes] Is array?', Array.isArray(data), 'Length:', Array.isArray(data) ? data.length : 'N/A')
      setTypes(Array.isArray(data) ? data : [])
      console.log('[useWorkshopTypes] State updated')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur'
      console.error('[useWorkshopTypes] Error:', message, err)
      setError(message)
    } finally {
      console.log('[useWorkshopTypes] Finally block - setting loading to false')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTypes().finally(() => setIsInitialized(true))
  }, [])

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

  return { types, loading, error, addType, updateType, deleteType, refetch: fetchTypes }
}

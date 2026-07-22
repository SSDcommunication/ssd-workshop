'use client'

import { useState, useEffect } from 'react'
import { WorkshopType } from '@/types'

export function useWorkshopTypes() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    fetchTypes().finally(() => setIsInitialized(true))
  }, [])

  const fetchTypes = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/workshop-types', { method: 'GET' })
      if (!response.ok) throw new Error('Erreur lors du chargement')
      const data = await response.json()
      setTypes(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur'
      setError(message)
      throw err
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

  return { types, loading, error, addType, updateType, deleteType, refetch: fetchTypes }
}

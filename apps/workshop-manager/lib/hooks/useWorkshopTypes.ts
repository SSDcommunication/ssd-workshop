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
      const response = await fetch('/api/workshop-types?page=1&limit=1000', { method: 'GET' })
      if (!response.ok) throw new Error(`HTTP ${response.status}: Erreur lors du chargement`)
      const result = await response.json()
      console.log('🔵 fetchTypes - Raw API Response:', result)

      // Support nouvelle structure avec pagination
      const data = result.items || result
      console.log('🔵 fetchTypes - Extracted data:', { data, isArray: Array.isArray(data), length: data?.length })

      if (!Array.isArray(data)) {
        console.error('❌ fetchTypes - Data is not an array:', typeof data, data)
        setTypes([])
        setError('Données invalides reçues')
        return
      }

      console.log('✅ fetchTypes - Setting types with', data.length, 'items')
      setTypes(data)
      console.log('✅ fetchTypes - Types set complete')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      console.error('❌ fetchTypes ERROR:', message, err)
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

'use client'

import { useState, useLayoutEffect } from 'react'
import { WorkshopType } from '@/types'

export function useWorkshopTypes() {
  const [types, setTypes] = useState<WorkshopType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useLayoutEffect(() => {
    console.log('[useWorkshopTypes] useEffect started')
    setLoading(true)
    setError(null)

    fetch('/api/workshop-types?page=1&limit=1000')
      .then(res => {
        console.log('[useWorkshopTypes] fetch response:', res.status)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        console.log('[useWorkshopTypes] parsed data, items:', data.items?.length)
        setTypes(data.items || [])
      })
      .catch(err => {
        console.error('[useWorkshopTypes] error:', err)
        setError(String(err))
      })
      .finally(() => {
        console.log('[useWorkshopTypes] finally block executed')
        setLoading(false)
      })
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/workshop-types?page=1&limit=1000')
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setTypes(data.items || [])
      setError(null)
    } catch (e) {
      setError(String(e))
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

  return { types, loading, error, addType, updateType, deleteType, refetch, isInitialized: !loading }
}

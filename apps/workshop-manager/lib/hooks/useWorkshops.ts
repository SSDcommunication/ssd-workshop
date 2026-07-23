import { useState, useEffect } from 'react'
import { Workshop } from '@/types'

export function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/workshops')
        if (!res.ok) throw new Error('Failed to fetch workshops')
        const data = await res.json()
        setWorkshops(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshops()
  }, [])

  const addWorkshop = async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshop),
      })
      if (!res.ok) throw new Error('Failed to add workshop')
      const newWorkshop = await res.json()
      setWorkshops([...workshops, newWorkshop])
      return newWorkshop
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
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
      if (!res.ok) throw new Error('Failed to update workshop')
      const updated = await res.json()
      setWorkshops(workshops.map((w) => (w.id === id ? updated : w)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteWorkshop = async (id: string) => {
    try {
      const res = await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete workshop')
      setWorkshops(workshops.filter((w) => w.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    workshops,
    loading,
    error,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
  }
}

import { useState, useEffect } from 'react'
import { Budget } from '@/types'

export function useBudget(workshopId?: string) {
  const [items, setItems] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/budget', window.location.origin)
        if (workshopId) {
          url.searchParams.append('workshop_id', workshopId)
        }
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch budget')
        const data = await res.json()
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchBudget()
  }, [workshopId])

  const addItem = async (item: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (!res.ok) throw new Error('Failed to add budget item')
      const newItem = await res.json()
      setItems([newItem, ...items])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateItem = async (id: string, updates: Partial<Budget>) => {
    try {
      const res = await fetch(`/api/budget/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update budget item')
      const updated = await res.json()
      setItems(items.map((i) => (i.id === id ? updated : i)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/budget/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete budget item')
      setItems(items.filter((i) => i.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
  }
}

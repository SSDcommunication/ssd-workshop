import { useState, useEffect } from 'react'
import { Task } from '@/types'

export function useTasks(workshopId?: string, status?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/tasks', window.location.origin)
        if (workshopId) url.searchParams.append('workshop_id', workshopId)
        if (status) url.searchParams.append('status', status)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch tasks')
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [workshopId, status])

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (!res.ok) throw new Error('Failed to add task')
      const newTask = await res.json()
      setTasks([...tasks, newTask])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update task')
      const updated = await res.json()
      setTasks(tasks.map((t) => (t.id === id ? updated : t)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
  }
}

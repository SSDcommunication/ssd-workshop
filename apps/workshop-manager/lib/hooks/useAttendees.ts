import { useState, useEffect } from 'react'
import { Attendee } from '@/types'

export function useAttendees(workshopId?: string) {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/attendees', window.location.origin)
        if (workshopId) {
          url.searchParams.append('workshop_id', workshopId)
        }
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch attendees')
        const data = await res.json()
        setAttendees(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAttendees()
  }, [workshopId])

  const addAttendee = async (attendee: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendee),
      })
      if (!res.ok) throw new Error('Failed to add attendee')
      const newAttendee = await res.json()
      setAttendees([newAttendee, ...attendees])
      return newAttendee
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateAttendee = async (id: string, updates: Partial<Attendee>) => {
    try {
      const res = await fetch(`/api/attendees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update attendee')
      const updated = await res.json()
      setAttendees(attendees.map((a) => (a.id === id ? updated : a)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteAttendee = async (id: string) => {
    try {
      const res = await fetch(`/api/attendees/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete attendee')
      setAttendees(attendees.filter((a) => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    attendees,
    loading,
    error,
    addAttendee,
    updateAttendee,
    deleteAttendee,
  }
}

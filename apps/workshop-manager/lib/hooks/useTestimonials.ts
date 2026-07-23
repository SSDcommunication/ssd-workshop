import { useState, useEffect } from 'react'
import { Testimonial } from '@/types'

export function useTestimonials(workshopId?: string) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/testimonials', window.location.origin)
        if (workshopId) {
          url.searchParams.append('workshop_id', workshopId)
        }
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch testimonials')
        const data = await res.json()
        setTestimonials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [workshopId])

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonial),
      })
      if (!res.ok) throw new Error('Failed to add testimonial')
      const newTestimonial = await res.json()
      setTestimonials([newTestimonial, ...testimonials])
      return newTestimonial
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update testimonial')
      const updated = await res.json()
      setTestimonials(testimonials.map((t) => (t.id === id ? updated : t)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteTestimonial = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete testimonial')
      setTestimonials(testimonials.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    testimonials,
    loading,
    error,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  }
}

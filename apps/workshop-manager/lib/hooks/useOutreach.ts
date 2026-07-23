import { useState, useEffect } from 'react'
import { OutreachContact } from '@/types'

export function useOutreach(workshopId?: string) {
  const [contacts, setContacts] = useState<OutreachContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/outreach', window.location.origin)
        if (workshopId) {
          url.searchParams.append('workshop_id', workshopId)
        }
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch outreach contacts')
        const data = await res.json()
        setContacts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [workshopId])

  const addContact = async (contact: Omit<OutreachContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      if (!res.ok) throw new Error('Failed to add contact')
      const newContact = await res.json()
      setContacts([newContact, ...contacts])
      return newContact
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateContact = async (id: string, updates: Partial<OutreachContact>) => {
    try {
      const res = await fetch(`/api/outreach/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update contact')
      const updated = await res.json()
      setContacts(contacts.map((c) => (c.id === id ? updated : c)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteContact = async (id: string) => {
    try {
      const res = await fetch(`/api/outreach/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete contact')
      setContacts(contacts.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
  }
}

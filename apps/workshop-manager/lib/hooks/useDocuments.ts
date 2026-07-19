'use client'

import { useState, useEffect } from 'react'
import { Document } from '@/types'

export function useDocuments(workshopId?: string) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workshopId) return
    fetchDocuments()
  }, [workshopId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/documents?workshop_id=${workshopId}`,
        { method: 'GET' }
      )
      if (!response.ok) throw new Error('Erreur lors du chargement')
      const data = await response.json()
      setDocuments(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const addDocument = async (doc: Omit<Document, 'id'>) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })
      if (!response.ok) throw new Error('Erreur lors de l\'ajout')
      const newDoc = await response.json()
      setDocuments([...documents, newDoc])
    } catch (err) {
      throw err
    }
  }

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      const updated = await response.json()
      setDocuments(documents.map((d) => (d.id === id ? updated : d)))
    } catch (err) {
      throw err
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      setDocuments(documents.filter((d) => d.id !== id))
    } catch (err) {
      throw err
    }
  }

  return { documents, loading, error, addDocument, updateDocument, deleteDocument }
}

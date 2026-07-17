import { useState, useEffect } from 'react'
import { EmailCampaign } from '@/types'

export function useEmailCampaigns(workshopId?: string) {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/email-campaigns', window.location.origin)
        if (workshopId) url.searchParams.append('workshop_id', workshopId)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch campaigns')
        const data = await res.json()
        setCampaigns(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [workshopId])

  const addCampaign = async (campaign: Omit<EmailCampaign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      })
      if (!res.ok) throw new Error('Failed to add campaign')
      const newCampaign = await res.json()
      setCampaigns([...campaigns, newCampaign])
      return newCampaign
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updateCampaign = async (id: string, updates: Partial<EmailCampaign>) => {
    try {
      const res = await fetch(`/api/email-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update campaign')
      const updated = await res.json()
      setCampaigns(campaigns.map((c) => (c.id === id ? updated : c)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deleteCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/email-campaigns/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete campaign')
      setCampaigns(campaigns.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    campaigns,
    loading,
    error,
    addCampaign,
    updateCampaign,
    deleteCampaign,
  }
}

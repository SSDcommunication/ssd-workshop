'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useOutreach } from '@/lib/hooks'
import { OutreachContact } from '@/types'

export default function OutreachManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { contacts, loading, error, addContact, updateContact, deleteContact } =
    useOutreach(workshopId || undefined)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_type: '',
    contact_person: '',
    email: '',
    phone_linkedin: '',
    status: 'new' as const,
    contact_date: new Date().toISOString().split('T')[0],
    response: '',
    followup_date: '',
    result_notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshopId) {
      alert('Sélectionnez un atelier')
      return
    }

    try {
      if (editingId) {
        await updateContact(editingId, formData)
        setEditingId(null)
      } else {
        await addContact({
          ...formData,
          workshop_id: workshopId,
          contact_date: formData.contact_date || new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<OutreachContact, 'id'>)
      }
      setFormData({
        organization_name: '',
        contact_type: '',
        contact_person: '',
        email: '',
        phone_linkedin: '',
        status: 'new',
        contact_date: new Date().toISOString().split('T')[0],
        response: '',
        followup_date: '',
        result_notes: '',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (contact: OutreachContact) => {
    setFormData({
      organization_name: contact.organization_name,
      contact_type: contact.contact_type,
      contact_person: contact.contact_person,
      email: contact.email,
      phone_linkedin: contact.phone_linkedin || '',
      status: contact.status,
      contact_date: contact.contact_date,
      response: contact.response || '',
      followup_date: contact.followup_date || '',
      result_notes: contact.result_notes || '',
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  const statusCounts = {
    new: contacts.filter((c) => c.status === 'new').length,
    contacted: contacts.filter((c) => c.status === 'contacted').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
    closed: contacts.filter((c) => c.status === 'closed').length,
  }

  const columns = [
    { key: 'organization_name', label: 'Organisation' },
    { key: 'contact_person', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'contact_type', label: 'Type' },
    {
      key: 'status',
      label: 'Statut',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === 'new'
              ? 'bg-gray-100 text-gray-800'
              : status === 'contacted'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'replied'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {status === 'new' ? 'Nouveau' : status === 'contacted' ? 'Contacté' : status === 'replied' ? 'Réponse' : 'Fermé'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => {
        const contact = contacts.find((c) => c.id === id)
        return (
          <div className="flex gap-2">
            <button
              onClick={() => contact && handleEdit(contact)}
              className="text-[#4dd1e3] hover:underline text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => deleteContact(id).catch(() => alert('Erreur'))}
              className="text-red-600 hover:underline text-sm"
            >
              Supprimer
            </button>
          </div>
        )
      },
    },
  ]

  if (!workshopId) {
    return (
      <div className="p-8">
        <p className="text-gray-600 text-center py-8">
          Sélectionnez d'abord un atelier
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Prospection & Partenariats</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Ajouter contact'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? 'Modifier contact' : 'Ajouter contact'} className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Organisation"
                required
                className="input-field"
                value={formData.organization_name}
                onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact"
                className="input-field"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Téléphone/LinkedIn"
                className="input-field"
                value={formData.phone_linkedin}
                onChange={(e) => setFormData({ ...formData, phone_linkedin: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Type de contact"
                className="input-field"
                value={formData.contact_type}
                onChange={(e) => setFormData({ ...formData, contact_type: e.target.value })}
              />
              <input
                type="date"
                className="input-field"
                value={formData.contact_date}
                onChange={(e) => setFormData({ ...formData, contact_date: e.target.value })}
              />
            </div>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'new' | 'contacted' | 'replied' | 'closed',
                })
              }
            >
              <option value="new">Nouveau</option>
              <option value="contacted">Contacté</option>
              <option value="replied">Réponse reçue</option>
              <option value="closed">Fermé</option>
            </select>
            <textarea
              placeholder="Réponse/Notes"
              className="input-field"
              rows={3}
              value={formData.response}
              onChange={(e) => setFormData({ ...formData, response: e.target.value })}
            />
            <input
              type="date"
              placeholder="Date de suivi"
              className="input-field"
              value={formData.followup_date}
              onChange={(e) => setFormData({ ...formData, followup_date: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sauvegarde...' : editingId ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm mb-2">Nouveaux contacts</p>
          <p className="text-3xl font-bold">{statusCounts.new}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Contactés</p>
          <p className="text-3xl font-bold text-yellow-600">{statusCounts.contacted}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Réponses</p>
          <p className="text-3xl font-bold text-blue-600">{statusCounts.replied}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Fermés</p>
          <p className="text-3xl font-bold text-green-600">{statusCounts.closed}</p>
        </Card>
      </div>

      {/* Contacts List */}
      <Card title="Contacts de prospection">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : contacts.length > 0 ? (
          <Table columns={columns} data={contacts} />
        ) : (
          <p className="text-gray-600 text-center py-8">Aucun contact pour le moment</p>
        )}
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useAttendees } from '@/lib/hooks'
import { Attendee } from '@/types'

export default function AttendeeManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { attendees, loading, error, addAttendee, updateAttendee, deleteAttendee } =
    useAttendees(workshopId || undefined)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    ticket_type: 'Standard',
    payment_status: 'pending' as const,
    amount_paid: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshopId) {
      alert('Sélectionnez un atelier')
      return
    }

    try {
      if (editingId) {
        await updateAttendee(editingId, formData)
        setEditingId(null)
      } else {
        await addAttendee({
          ...formData,
          workshop_id: workshopId,
          registration_date: new Date().toISOString().split('T')[0],
          synced_to_crm: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<Attendee, 'id'>)
      }
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        city: '',
        ticket_type: 'Standard',
        payment_status: 'pending',
        amount_paid: 0,
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (attendee: Attendee) => {
    setFormData({
      full_name: attendee.full_name,
      email: attendee.email,
      phone: attendee.phone || '',
      city: attendee.city || '',
      ticket_type: attendee.ticket_type,
      payment_status: attendee.payment_status,
      amount_paid: attendee.amount_paid,
    })
    setEditingId(attendee.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr ?')) {
      try {
        await deleteAttendee(id)
      } catch (err) {
        alert('Erreur lors de la suppression')
      }
    }
  }

  const columns = [
    { key: 'full_name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'ticket_type', label: 'Billet' },
    {
      key: 'payment_status',
      label: 'Paiement',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === 'paid'
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status === 'paid' ? 'Payé' : status === 'pending' ? 'En attente' : 'Remboursé'}
        </span>
      ),
    },
    { key: 'amount_paid', label: 'Montant (€)' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => {
        const attendee = attendees.find((a) => a.id === id)
        return (
          <div className="flex gap-2">
            <button
              onClick={() => attendee && handleEdit(attendee)}
              className="text-[#4dd1e3] hover:underline text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(id)}
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
          Sélectionnez d'abord un atelier pour voir les inscrits
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Inscrits</h1>
        <div className="flex gap-3">
          <button className="btn-secondary" disabled>
            ⬇️ Importer CSV
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                full_name: '',
                email: '',
                phone: '',
                city: '',
                ticket_type: 'Standard',
                payment_status: 'pending',
                amount_paid: 0,
              })
            }}
            className="btn-primary"
          >
            {showForm ? 'Annuler' : '+ Ajouter inscrit'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? 'Modifier inscrit' : 'Ajouter un nouvel inscrit'} className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                required
                className="input-field"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Téléphone"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Ville"
                className="input-field"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="input-field"
                value={formData.ticket_type}
                onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
              >
                <option>Standard</option>
                <option>VIP</option>
                <option>Early Bird</option>
              </select>
              <select
                className="input-field"
                value={formData.payment_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_status: e.target.value as 'pending' | 'paid' | 'refunded',
                  })
                }
              >
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="refunded">Remboursé</option>
              </select>
            </div>
            <input
              type="number"
              placeholder="Montant payé (€)"
              step="0.01"
              min="0"
              className="input-field"
              value={formData.amount_paid}
              onChange={(e) => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) })}
            />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Sauvegarde...' : editingId ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total inscrits</p>
          <p className="text-3xl font-bold text-gray-900">{attendees.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Payés</p>
          <p className="text-3xl font-bold text-green-600">
            {attendees.filter((a) => a.payment_status === 'paid').length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">
            {attendees.filter((a) => a.payment_status === 'pending').length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Revenu</p>
          <p className="text-3xl font-bold text-[#4dd1e3]">
            {attendees.reduce((sum, a) => sum + a.amount_paid, 0).toFixed(2)}€
          </p>
        </div>
      </div>

      <Card title="Liste des inscrits">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : (
          <Table columns={columns} data={attendees} />
        )}
      </Card>
    </div>
  )
}

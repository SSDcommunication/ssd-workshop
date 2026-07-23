'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { Attendee } from '@/types'

export default function AttendeeManager() {
  const [attendees, setAttendees] = useState<Attendee[]>([
    {
      id: '1',
      workshop_id: '2',
      full_name: 'Marie Dupont',
      email: 'marie@example.com',
      phone: '+33612345678',
      country: 'France',
      city: 'Paris',
      ticket_type: 'Standard',
      payment_status: 'paid',
      amount_paid: 49,
      registration_date: '2026-07-10',
      synced_to_crm: true,
      notes: 'Cliente existante IKIGAI',
      created_at: '2026-07-10',
      updated_at: '2026-07-10',
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const columns = [
    { key: 'full_name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'ticket_type', label: 'Billet' },
    { key: 'payment_status', label: 'Paiement' },
    { key: 'amount_paid', label: 'Montant (€)' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="text-[#4dd1e3] hover:underline text-sm">
            Modifier
          </button>
          <button className="text-red-600 hover:underline text-sm">
            Supprimer
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Inscrits</h1>
        <div className="flex gap-3">
          <button className="btn-secondary">⬇️ Importer CSV</button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Annuler' : '+ Ajouter inscrit'}
          </button>
        </div>
      </div>

      {showForm && (
        <Card title="Ajouter un nouvel inscrit" className="mb-8">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nom complet" className="input-field" />
              <input type="email" placeholder="Email" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="tel" placeholder="Téléphone" className="input-field" />
              <input type="text" placeholder="Ville" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select className="input-field">
                <option>Type de billet</option>
                <option>Standard</option>
                <option>VIP</option>
                <option>Early Bird</option>
              </select>
              <select className="input-field">
                <option>Statut paiement</option>
                <option>Pending</option>
                <option>Paid</option>
                <option>Refunded</option>
              </select>
            </div>
            <input type="number" placeholder="Montant payé (€)" className="input-field" />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
            {attendees.reduce((sum, a) => sum + a.amount_paid, 0)}€
          </p>
        </div>
      </div>

      <Card title="Liste des inscrits">
        <Table columns={columns} data={attendees} />
      </Card>
    </div>
  )
}

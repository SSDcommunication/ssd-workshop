'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { EmailCampaign } from '@/types'

export default function EmailCampaignManager() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      workshop_id: '2',
      subject: 'Un atelier pour clarifier votre marque',
      target_segment: 'Prospects SSD + anciens IKIGAI',
      send_date: '2026-07-24',
      status: 'draft',
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
      unsubscribed_count: 0,
      open_rate: 0,
      click_rate: 0,
      cta: 'S\'inscrire',
      notes: 'Semaine 1 - Annonce',
      created_at: '2026-07-17',
      updated_at: '2026-07-17',
    },
  ])

  const columns = [
    { key: 'subject', label: 'Sujet' },
    { key: 'status', label: 'Statut' },
    { key: 'send_date', label: 'Date d\'envoi' },
    { key: 'sent_count', label: 'Envoyés' },
    { key: 'open_rate', label: 'Taux ouverture' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="text-[#4dd1e3] hover:underline text-sm">
            Modifier
          </button>
          <button className="text-orange-600 hover:underline text-sm">
            Envoyer
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Campagnes Email</h1>
        <button className="btn-primary">+ Créer campagne</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total campagnes</p>
          <p className="text-3xl font-bold">{campaigns.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Brouillons</p>
          <p className="text-3xl font-bold text-gray-600">
            {campaigns.filter((c) => c.status === 'draft').length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Planifiées</p>
          <p className="text-3xl font-bold text-blue-600">
            {campaigns.filter((c) => c.status === 'scheduled').length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Envoyées</p>
          <p className="text-3xl font-bold text-green-600">
            {campaigns.filter((c) => c.status === 'sent').length}
          </p>
        </div>
      </div>

      <Card title="Séquence SSD Communication (6 semaines)">
        <div className="space-y-3">
          {campaigns.map((c, idx) => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-semibold text-gray-900">{idx + 1}. {c.subject}</p>
                <p className="text-sm text-gray-600">{c.notes}</p>
              </div>
              <div className="flex gap-3 items-center">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  c.status === 'draft'
                    ? 'bg-gray-200 text-gray-800'
                    : c.status === 'scheduled'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-green-200 text-green-800'
                }`}>
                  {c.status === 'draft' ? 'Brouillon' : c.status === 'scheduled' ? 'Planifiée' : 'Envoyée'}
                </span>
                <button className="text-[#4dd1e3] hover:underline text-sm">Modifier</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

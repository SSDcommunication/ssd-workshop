'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import { useEmailCampaigns } from '@/lib/hooks'
import { EmailCampaign } from '@/types'

export default function EmailCampaignManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { campaigns, loading, error, addCampaign, updateCampaign, deleteCampaign } =
    useEmailCampaigns(workshopId || undefined)

  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)

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
        <h1 className="text-4xl font-bold text-gray-900">Campagnes Email</h1>
        <button className="btn-primary">+ Créer campagne</button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

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
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c, idx) => (
              <div
                key={c.id}
                onClick={() => setSelectedCampaign(c)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {idx + 1}. {c.subject}
                  </p>
                  <p className="text-sm text-gray-600">{c.notes}</p>
                  {c.open_rate !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ouverture: {c.open_rate.toFixed(1)}% | Clics: {c.click_rate?.toFixed(1)}%
                    </p>
                  )}
                </div>
                <div className="flex gap-3 items-center">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${
                      c.status === 'draft'
                        ? 'bg-gray-200 text-gray-800'
                        : c.status === 'scheduled'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-green-200 text-green-800'
                    }`}
                  >
                    {c.status === 'draft'
                      ? 'Brouillon'
                      : c.status === 'scheduled'
                      ? 'Planifiée'
                      : 'Envoyée'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCampaign(c.id).catch(() => alert('Erreur'))
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedCampaign && (
        <Card title={`Détails: ${selectedCampaign.subject}`} className="mt-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Segment cible</p>
                <p className="font-semibold">{selectedCampaign.target_segment}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date d'envoi</p>
                <p className="font-semibold">{selectedCampaign.send_date}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Envoyés</p>
                <p className="text-xl font-bold">{selectedCampaign.sent_count || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ouverts</p>
                <p className="text-xl font-bold">{selectedCampaign.opened_count || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliqués</p>
                <p className="text-xl font-bold">{selectedCampaign.clicked_count || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Désinscrits</p>
                <p className="text-xl font-bold">{selectedCampaign.unsubscribed_count || 0}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">CTA</p>
              <p className="bg-gray-100 p-2 rounded">{selectedCampaign.cta}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedCampaign.status === 'draft') {
                    updateCampaign(selectedCampaign.id, { status: 'scheduled' })
                      .then(() => setSelectedCampaign(null))
                      .catch(() => alert('Erreur'))
                  }
                }}
                className="btn-primary flex-1"
                disabled={selectedCampaign.status !== 'draft'}
              >
                {selectedCampaign.status === 'draft' ? 'Planifier' : 'Déjà ' + selectedCampaign.status}
              </button>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="btn-secondary flex-1"
              >
                Fermer
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

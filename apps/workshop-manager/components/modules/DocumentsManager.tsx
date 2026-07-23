'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useDocuments } from '@/lib/hooks'
import { Document } from '@/types'

export default function DocumentsManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { documents, loading, error, addDocument, deleteDocument } =
    useDocuments(workshopId || undefined)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    file_name: '',
    file_url: '',
    visibility: 'me' as 'me' | 'participants',
    ticket_types: [] as string[],
    send_to_all: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshopId) {
      alert('Sélectionnez un atelier')
      return
    }

    if (!formData.file_name || !formData.file_url) {
      alert('Remplissez tous les champs requis')
      return
    }

    try {
      await addDocument({
        workshop_id: workshopId,
        file_name: formData.file_name,
        file_url: formData.file_url,
        visibility: formData.visibility,
        ticket_types: formData.visibility === 'participants' && !formData.send_to_all
          ? formData.ticket_types
          : [],
        send_to_all: formData.visibility === 'participants' && formData.send_to_all,
        uploaded_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Omit<Document, 'id'>)

      setFormData({
        file_name: '',
        file_url: '',
        visibility: 'me',
        ticket_types: [],
        send_to_all: false,
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de l\'ajout du document')
    }
  }

  const ticketTypes = ['Standard', 'Premium', 'VIP']

  const toggleTicketType = (type: string) => {
    setFormData({
      ...formData,
      ticket_types: formData.ticket_types.includes(type)
        ? formData.ticket_types.filter((t) => t !== type)
        : [...formData.ticket_types, type],
      send_to_all: false,
    })
  }

  const columns = [
    { key: 'file_name', label: 'Fichier' },
    {
      key: 'visibility',
      label: 'Visibilité',
      render: (visibility: string) => (
        <span className="text-sm">
          {visibility === 'me' ? 'Pour moi' : 'Pour les participants'}
        </span>
      ),
    },
    {
      key: 'send_to_all',
      label: 'Distribution',
      render: (sendToAll: boolean, doc: Document) => {
        if (doc.visibility === 'me') return '-'
        if (sendToAll) return <span className="font-medium text-[#4dd1e3]">Pour tous</span>
        return doc.ticket_types?.join(', ') || '-'
      },
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <button
          onClick={() => deleteDocument(id).catch(() => alert('Erreur'))}
          className="text-red-600 hover:underline text-sm"
        >
          Supprimer
        </button>
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
        <h1 className="text-4xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({
                file_name: '',
                file_url: '',
                visibility: 'me',
                ticket_types: [],
                send_to_all: false,
              })
            }
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Ajouter document'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title="Ajouter un document" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choisir un fichier</label>
              <input
                type="text"
                placeholder="Aucun fichier choisi"
                disabled
                className="input-field bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Destinataires</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="me"
                    checked={formData.visibility === 'me'}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: 'me' as 'me' | 'participants' })
                    }
                  />
                  <span>Pour moi</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="participants"
                    checked={formData.visibility === 'participants'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: 'participants' as 'me' | 'participants',
                      })
                    }
                  />
                  <span>Pour les participants</span>
                </label>
              </div>
            </div>

            {formData.visibility === 'participants' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded border border-gray-200">
                <label className="block text-sm font-medium">Gammes cibles :</label>

                <div className="space-y-2">
                  {ticketTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.ticket_types.includes(type)}
                        onChange={() => toggleTicketType(type)}
                        disabled={formData.send_to_all}
                      />
                      <span>{type}</span>
                    </label>
                  ))}

                  <div className="pt-2 border-t border-gray-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.send_to_all}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            send_to_all: e.target.checked,
                            ticket_types: [],
                          })
                        }
                      />
                      <span className="font-medium text-[#4dd1e3]">Pour tous</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="Nom du fichier"
              required
              className="input-field"
              value={formData.file_name}
              onChange={(e) => setFormData({ ...formData, file_name: e.target.value })}
            />

            <input
              type="url"
              placeholder="URL du fichier"
              required
              className="input-field"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            />

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </form>
        </Card>
      )}

      <Card title="Documents">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : documents.length > 0 ? (
          <Table columns={columns} data={documents} />
        ) : (
          <p className="text-gray-600 text-center py-8">Aucun document pour le moment</p>
        )}
      </Card>
    </div>
  )
}

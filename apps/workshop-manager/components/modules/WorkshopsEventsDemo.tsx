'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useMockWorkshops, useMockWorkshopTypes } from '@/lib/hooks/useMockData'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function WorkshopsEventsDemo() {
  const { types } = useMockWorkshopTypes()
  const { workshops, loading, error, addWorkshop, deleteWorkshop } = useMockWorkshops()

  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'archived',
  })

  const selectedType = types.find((t) => t.id === selectedTypeId)
  const workshopsForType = selectedTypeId
    ? workshops.filter((w) => w.workshop_type_id === selectedTypeId)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTypeId || !formData.name || !formData.date) {
      alert('Sélectionnez un atelier et remplissez tous les champs')
      return
    }

    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      await addWorkshop({
        workshop_type_id: selectedTypeId,
        name: formData.name,
        slug,
        description: selectedType?.description,
        date: formData.date,
        status: formData.status,
        max_attendees: selectedType?.places_ideal || 25,
        price: selectedType?.price || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      setFormData({
        name: '',
        date: '',
        status: 'planning',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la création')
    }
  }

  const columns = [
    { key: 'name', label: 'Événement' },
    {
      key: 'date',
      label: 'Date & Heure',
      render: (value: string) =>
        format(new Date(value), 'EEEE dd MMMM yyyy - HH:mm', { locale: fr }),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === 'planning'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'active'
              ? 'bg-green-100 text-green-800'
              : status === 'completed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status === 'planning'
            ? 'En construction'
            : status === 'active'
            ? 'Actif'
            : status === 'completed'
            ? 'Terminé'
            : 'Archivé'}
        </span>
      ),
    },
    { key: 'max_attendees', label: 'Places' },
    { key: 'price', label: 'Prix (€)' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button
            onClick={() => deleteWorkshop(id)}
            className="text-red-600 hover:underline text-sm"
          >
            Supprimer
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded flex items-center gap-2">
        <span className="text-xl">🎬</span>
        <p className="text-sm text-purple-900"><strong>Mode Démo</strong> - Données simulées pour tester l'interface</p>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestion des Événements</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Sélection de l'atelier */}
      <Card title="1️⃣ Sélectionnez un atelier" className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedTypeId(type.id)
                setShowForm(false)
              }}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTypeId === type.id
                  ? 'border-[#4dd1e3] bg-[#4dd1e3]/10'
                  : 'border-gray-200 hover:border-[#4dd1e3]'
              }`}
            >
              <h3 className="font-bold text-lg">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
              <div className="mt-2 text-sm text-gray-700">
                🎯 {type.places_ideal} places · 💰 {type.price}€
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selectedType && (
        <>
          {/* Création d'événement */}
          <Card title={`2️⃣ Créer un événement pour "${selectedType.name}"`} className="mb-8">
            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom de l'événement</label>
                  <input
                    type="text"
                    placeholder={`Ex: ${selectedType.name} - Juillet 2026 - Paris`}
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Incluez le lieu si plusieurs événements</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date et Heure</label>
                    <input
                      type="datetime-local"
                      required
                      className="input-field"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Statut initial</label>
                    <select
                      className="input-field"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as 'planning' | 'active' | 'completed' | 'archived',
                        })
                      }
                    >
                      <option value="planning">En construction</option>
                      <option value="active">Actif</option>
                      <option value="completed">Terminé</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded text-sm text-blue-900">
                  ℹ️ Cet événement hérite de: <strong>{selectedType.places_ideal} places</strong> et <strong>{selectedType.price}€</strong>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Création...' : '+ Créer l\'événement'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary w-full"
              >
                + Créer un événement
              </button>
            )}
          </Card>

          {/* Liste des événements */}
          <Card title={`3️⃣ Événements de "${selectedType.name}"`}>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Chargement...</p>
            ) : workshopsForType.length > 0 ? (
              <>
                <Table columns={columns} data={workshopsForType} />
                <div className="mt-4 p-3 bg-green-50 rounded text-sm text-green-800 border border-green-200">
                  ✓ {workshopsForType.length} événement{workshopsForType.length > 1 ? 's' : ''} configuré{workshopsForType.length > 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Aucun événement créé pour cet atelier
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#4dd1e3] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
                >
                  Créer le premier événement
                </button>
              </div>
            )}
          </Card>

          {/* Info pour la gestion */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Card title="📅 Agenda">
              <p className="text-sm text-gray-600">
                Cliquez sur le bouton "Agenda" pour gérer les horaires, sessions et speakers.
              </p>
              <button className="mt-2 text-[#4dd1e3] text-sm hover:underline">
                Voir guide agenda →
              </button>
            </Card>
            <Card title="📋 Suivi">
              <p className="text-sm text-gray-600">
                Consultez le statut, les inscriptions, et les tâches associées dans "Détails".
              </p>
              <button className="mt-2 text-[#4dd1e3] text-sm hover:underline">
                Voir guide suivi →
              </button>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

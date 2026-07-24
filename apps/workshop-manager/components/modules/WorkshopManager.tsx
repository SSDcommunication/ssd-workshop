'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useWorkshops, useWorkshopTypes } from '@/lib/hooks'
import { Workshop, WorkshopType } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function WorkshopManager() {
  const { types } = useWorkshopTypes()
  const { workshops, loading, error, addWorkshop, deleteWorkshop } = useWorkshops()

  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'archived',
  })

  const selectedType = types.find((t) => t.id === selectedTypeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTypeId || !formData.name || !formData.date) {
      alert('Sélectionnez un type et remplissez tous les champs')
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
      } as Omit<Workshop, 'id'>)

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

  const workshopsForType = selectedTypeId
    ? workshops.filter((w) => w.workshop_type_id === selectedTypeId)
    : []

  const columns = [
    { key: 'name', label: 'Nom' },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) =>
        format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
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
        <div className="flex gap-2 flex-wrap">
          <a
            href={`/workshops/${id}?type=${selectedTypeId}`}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm inline-block"
          >
            👁 Voir
          </a>
          <button
            onClick={() => deleteWorkshop(id).catch(() => alert('Erreur'))}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
          >
            🗑 Supprimer
          </button>
        </div>
      ),
    },
  ]

  if (!types || types.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-blue-50 border border-blue-200 rounded p-6 text-center">
          <p className="text-blue-900">
            👉 <strong>Commencez par créer un type d'atelier</strong>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Allez à "Types d'ateliers" pour créer IKIGAI, puis vous pourrez créer des dates ici
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Ateliers</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Sélection du type */}
      <Card title="1. Sélectionnez un type d'atelier" className="mb-8">
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
              <div className="mt-2 text-sm">
                <span className="text-gray-700">
                  Places: {type.places_min}-{type.places_max} (idéal: {type.places_ideal})
                </span>
                <span className="ml-4 font-semibold">{type.price}€</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {selectedType && (
        <>
          {/* Création de dates */}
          <Card title={`2. Créer une date pour ${selectedType.name}`} className="mb-8">
            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom de l'atelier</label>
                  <input
                    type="text"
                    placeholder={`Ex: ${selectedType.name} - Juillet 2026`}
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
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
                  ℹ️ Cette atelier hérite de : <strong>{selectedType.places_ideal} places</strong> (min: {selectedType.places_min}, max: {selectedType.places_max}) et <strong>{selectedType.price}€</strong>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Création...' : 'Créer l\'atelier'}
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
                + Créer une date pour {selectedType.name}
              </button>
            )}
          </Card>

          {/* Liste des ateliers */}
          <Card title={`Ateliers de type "${selectedType.name}"`}>
            {loading ? (
              <p className="text-center text-gray-500 py-8">Chargement...</p>
            ) : workshopsForType.length > 0 ? (
              <Table columns={columns} data={workshopsForType} />
            ) : (
              <p className="text-gray-600 text-center py-8">
                Aucun atelier créé pour ce type. Créez-en un ci-dessus !
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

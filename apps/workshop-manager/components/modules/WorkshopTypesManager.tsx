'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useWorkshopTypes } from '@/lib/hooks'
import { WorkshopType } from '@/types'

export default function WorkshopTypesManager() {
  const { types, loading, error, addType, updateType, deleteType } = useWorkshopTypes()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    places_min: 1,
    places_max: 50,
    places_ideal: 25,
    price: 0,
    documents_by_status: {
      en_construction: [] as string[],
      actif: [] as string[],
      archive: [] as string[],
    },
    status: 'active' as 'active' | 'archived',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      alert('Remplissez tous les champs requis')
      return
    }

    try {
      if (editingId) {
        await updateType(editingId, formData as Partial<WorkshopType>)
        setEditingId(null)
      } else {
        await addType({
          ...formData,
          id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<WorkshopType, 'id'>)
      }

      setFormData({
        name: '',
        slug: '',
        description: '',
        places_min: 1,
        places_max: 50,
        places_ideal: 25,
        price: 0,
        documents_by_status: {
          en_construction: [],
          actif: [],
          archive: [],
        },
        status: 'active',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (type: WorkshopType) => {
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description || '',
      places_min: type.places_min,
      places_max: type.places_max,
      places_ideal: type.places_ideal,
      price: type.price,
      documents_by_status: type.documents_by_status,
      status: type.status,
    })
    setEditingId(type.id)
    setShowForm(true)
  }

  const columns = [
    { key: 'name', label: 'Nom du type' },
    {
      key: 'places_min',
      label: 'Places',
      render: (min: number, type: WorkshopType) =>
        `${type.places_min}-${type.places_max} (idéal: ${type.places_ideal})`,
    },
    {
      key: 'price',
      label: 'Prix',
      render: (price: number) => `${price}€`,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {status === 'active' ? 'Actif' : 'Archivé'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => {
        const type = types.find((t) => t.id === id)
        return (
          <div className="flex gap-2">
            <button
              onClick={() => type && handleEdit(type)}
              className="text-[#4dd1e3] hover:underline text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => deleteType(id).catch(() => alert('Erreur'))}
              className="text-red-600 hover:underline text-sm"
            >
              Supprimer
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Types d'ateliers</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              name: '',
              slug: '',
              description: '',
              places_min: 1,
              places_max: 50,
              places_ideal: 25,
              price: 0,
              documents_by_status: {
                en_construction: [],
                actif: [],
                archive: [],
              },
              status: 'active',
            })
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Créer un type'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? 'Modifier le type' : 'Créer un type d\'atelier'} className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du type (ex: IKIGAI)"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Slug (ex: ikigai)"
                required
                className="input-field"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Description"
              className="input-field"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="grid grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Places min"
                className="input-field"
                value={formData.places_min}
                onChange={(e) =>
                  setFormData({ ...formData, places_min: parseInt(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Places max"
                className="input-field"
                value={formData.places_max}
                onChange={(e) =>
                  setFormData({ ...formData, places_max: parseInt(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Places idéal"
                className="input-field"
                value={formData.places_ideal}
                onChange={(e) =>
                  setFormData({ ...formData, places_ideal: parseInt(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Prix (€)"
                className="input-field"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                className="input-field"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'archived',
                  })
                }
              >
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              📄 <strong>Documents par statut :</strong> À configurer après création (documents à envoyer selon le statut de l'atelier)
            </p>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Enregistrement...' : editingId ? 'Modifier' : 'Créer'}
            </button>
          </form>
        </Card>
      )}

      <Card title="Types d'ateliers configurés">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : types.length > 0 ? (
          <Table columns={columns} data={types} />
        ) : (
          <p className="text-gray-600 text-center py-8">Aucun type d'atelier pour le moment</p>
        )}
      </Card>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-900">
          💡 <strong>Prochaine étape :</strong> Une fois votre type créé, vous pourrez créer des instances (dates) de cet atelier dans la section "Ateliers".
        </p>
      </div>
    </div>
  )
}

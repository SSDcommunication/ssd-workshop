'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { Workshop } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function WorkshopManager() {
  const [workshops, setWorkshops] = useState<Workshop[]>([
    {
      id: '1',
      name: 'IKIGAI Business',
      slug: 'ikigai-business',
      description: 'Trouver votre positionnement',
      date: '2026-08-15',
      status: 'active',
      max_attendees: 50,
      price: 97,
      created_at: '2026-07-01',
      updated_at: '2026-07-01',
    },
    {
      id: '2',
      name: 'SSD Communication',
      slug: 'ssd-communication',
      description: 'Clarifier votre communication',
      date: '2026-08-01',
      status: 'planning',
      max_attendees: 12,
      price: 0,
      created_at: '2026-07-17',
      updated_at: '2026-07-17',
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    date: '',
    max_attendees: 50,
    price: 0,
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newWorkshop: Workshop = {
      id: Date.now().toString(),
      ...formData,
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setWorkshops([...workshops, newWorkshop])
    setFormData({
      name: '',
      slug: '',
      date: '',
      max_attendees: 50,
      price: 0,
      description: '',
    })
    setShowForm(false)
  }

  const columns = [
    { key: 'name', label: 'Nom' },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) =>
        format(new Date(value), 'dd MMMM yyyy', { locale: fr }),
    },
    { key: 'status', label: 'Statut' },
    { key: 'max_attendees', label: 'Max inscrits' },
    { key: 'price', label: 'Prix (€)' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <a href={`/workshops/${id}`} className="text-[#4dd1e3] hover:underline">
            Voir
          </a>
          <button className="text-red-600 hover:underline">Supprimer</button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Ateliers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Créer un atelier'}
        </button>
      </div>

      {showForm && (
        <Card title="Créer un nouvel atelier" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'atelier
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max inscrits
              </label>
              <input
                type="number"
                className="input-field"
                value={formData.max_attendees}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_attendees: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="input-field"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Créer
            </button>
          </form>
        </Card>
      )}

      <Card title="Liste des ateliers">
        <Table columns={columns} data={workshops} />
      </Card>
    </div>
  )
}

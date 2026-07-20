'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useWorkshops } from '@/lib/hooks'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function WorkshopsList() {
  const { workshops, loading, error, deleteWorkshop } = useWorkshops()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredWorkshops = filterStatus === 'all'
    ? workshops
    : workshops.filter(w => w.status === filterStatus)

  const statuses = [
    { value: 'all', label: 'Tous' },
    { value: 'planning', label: 'En construction' },
    { value: 'active', label: 'Actif' },
    { value: 'completed', label: 'Terminé' },
    { value: 'archived', label: 'Archivé' },
  ]

  const columns = [
    { key: 'name', label: 'Nom' },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) =>
        format(new Date(value), 'dd MMMM yyyy - HH:mm', { locale: fr }),
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
          <a href={`/workshops/${id}`} className="text-[#4dd1e3] hover:underline text-sm">
            Voir
          </a>
          <a href={`/workshops/${id}/edit`} className="text-[#4dd1e3] hover:underline text-sm">
            Modifier
          </a>
          <button
            onClick={() => deleteWorkshop(id).catch(() => alert('Erreur'))}
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Ateliers</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filtres */}
      <Card title="Filtrer par statut" className="mb-8">
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-4 py-2 rounded transition-all ${
                filterStatus === status.value
                  ? 'bg-[#4dd1e3] text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Liste des ateliers */}
      <Card title={`Ateliers (${filteredWorkshops.length})`}>
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : filteredWorkshops.length > 0 ? (
          <Table columns={columns} data={filteredWorkshops} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {workshops.length === 0
                ? 'Aucun atelier créé. Allez à "Créer des ateliers" pour en créer.'
                : 'Aucun atelier avec ce statut.'}
            </p>
            {workshops.length === 0 && (
              <a
                href="/workshops/manage"
                className="inline-block mt-4 bg-[#4dd1e3] text-white px-6 py-2 rounded hover:opacity-90 transition-opacity"
              >
                + Créer un atelier
              </a>
            )}
          </div>
        )}
      </Card>

      {/* Statistiques */}
      {workshops.length > 0 && (
        <div className="mt-8 grid grid-cols-4 gap-4">
          <Card title="Total">
            <p className="text-3xl font-bold text-[#4dd1e3]">{workshops.length}</p>
          </Card>
          <Card title="Actifs">
            <p className="text-3xl font-bold text-green-600">
              {workshops.filter(w => w.status === 'active').length}
            </p>
          </Card>
          <Card title="En construction">
            <p className="text-3xl font-bold text-yellow-600">
              {workshops.filter(w => w.status === 'planning').length}
            </p>
          </Card>
          <Card title="Terminés">
            <p className="text-3xl font-bold text-blue-600">
              {workshops.filter(w => w.status === 'completed').length}
            </p>
          </Card>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-900">
          <strong>💡 Besoin de créer ou modifier un atelier?</strong>
        </p>
        <p className="text-sm text-blue-700 mt-2">
          Allez à l'onglet <strong>"Créer/Modifier"</strong> pour créer de nouveaux ateliers ou modifier ceux existants.
        </p>
      </div>
    </div>
  )
}

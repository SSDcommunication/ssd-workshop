'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useWorkshopTypes } from '@/lib/hooks'
import { WorkshopType } from '@/types'
import { validateWorkshopType, hasErrors } from '@/lib/validators'
import FormError from '../ui/FormError'
import ConfirmDialog from '../ui/ConfirmDialog'
import StatusBadge from '../ui/StatusBadge'
import { useToast } from '../ui/Toast/ToastContext'
import { WORKSHOP_TYPE_STATUSES, type WorkshopTypeStatus } from '@/lib/constants'

const INITIAL_FORM_DATA = {
  name: '',
  slug: '',
  description: '',
  places_min: 5,
  places_max: 30,
  places_ideal: 20,
  price: 49,
  documents_by_status: {
    en_construction: [] as string[],
    actif: [] as string[],
    archive: [] as string[],
  },
  status: 'active' as WorkshopTypeStatus,
}

export default function WorkshopsCreation() {
  const { types, loading, error, addType, updateType, deleteType } = useWorkshopTypes()
  const { addToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false)

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const selectedType = selectedTypeId ? types.find(t => t.id === selectedTypeId) : null

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors({})
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateWorkshopType(formData)
    if (hasErrors(errors)) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateType(editingId, formData as Partial<WorkshopType>)
        addToast({
          type: 'success',
          message: 'Atelier modifié avec succès',
          duration: 3000,
        })
      } else {
        await addType({
          ...formData,
          id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<WorkshopType, 'id'>)
        addToast({
          type: 'success',
          message: 'Atelier créé avec succès',
          duration: 3000,
        })
      }
      resetForm()
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors de la sauvegarde',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
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
    setFormErrors({})
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    setDeleteConfirmLoading(true)
    try {
      await deleteType(deleteConfirmId)
      addToast({
        type: 'success',
        message: 'Atelier supprimé',
        duration: 3000,
      })
      setDeleteConfirmId(null)
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors de la suppression',
        duration: 5000,
      })
    } finally {
      setDeleteConfirmLoading(false)
    }
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
      render: (status: string) => <StatusBadge status={status} type="workshop_type" />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => {
        const type = types.find((t) => t.id === id)
        return (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedTypeId(id)
                setShowForm(false)
              }}
              className="text-[#4dd1e3] hover:underline text-sm"
              aria-label={selectedTypeId === id ? 'Désélectionner' : 'Sélectionner'}
            >
              {selectedTypeId === id ? '✓ Sélectionné' : 'Sélectionner'}
            </button>
            <button
              onClick={() => type && handleEdit(type)}
              className="text-[#4dd1e3] hover:underline text-sm"
              aria-label={`Modifier ${type?.name}`}
            >
              Modifier
            </button>
            <button
              onClick={() => setDeleteConfirmId(id)}
              className="text-red-600 hover:underline text-sm"
              aria-label={`Supprimer ${type?.name}`}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Configuration des Ateliers</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Créer un atelier'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? 'Modifier l\'atelier' : 'Créer un nouvel atelier'} className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Nom de l'atelier</label>
                <input
                  id="name"
                  type="text"
                  placeholder="ex: IKIGAI"
                  className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' })
                  }}
                />
                <FormError error={formErrors.name} />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug</label>
                <input
                  id="slug"
                  type="text"
                  placeholder="ex: ikigai"
                  className={`input-field ${formErrors.slug ? 'border-red-500' : ''}`}
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value })
                    if (formErrors.slug) setFormErrors({ ...formErrors, slug: '' })
                  }}
                />
                <FormError error={formErrors.slug} />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
              <textarea
                id="description"
                placeholder="Description complète de l'atelier"
                className={`input-field ${formErrors.description ? 'border-red-500' : ''}`}
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value })
                  if (formErrors.description) setFormErrors({ ...formErrors, description: '' })
                }}
              />
              <FormError error={formErrors.description} />
            </div>

            <fieldset className="bg-gray-50 p-4 rounded border border-gray-200">
              <legend className="font-semibold mb-3 text-gray-900">Configuration des Places</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="places_min" className="block text-sm font-medium mb-2">Minimum</label>
                  <input
                    id="places_min"
                    type="number"
                    className="input-field"
                    value={formData.places_min}
                    onChange={(e) =>
                      setFormData({ ...formData, places_min: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="places_max" className="block text-sm font-medium mb-2">Maximum</label>
                  <input
                    id="places_max"
                    type="number"
                    className="input-field"
                    value={formData.places_max}
                    onChange={(e) =>
                      setFormData({ ...formData, places_max: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="places_ideal" className="block text-sm font-medium mb-2">Idéal</label>
                  <input
                    id="places_ideal"
                    type="number"
                    className="input-field"
                    value={formData.places_ideal}
                    onChange={(e) =>
                      setFormData({ ...formData, places_ideal: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <FormError error={formErrors.places} />
            </fieldset>

            <fieldset className="bg-gray-50 p-4 rounded border border-gray-200">
              <legend className="font-semibold mb-3 text-gray-900">Tarif</legend>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">Prix (€)</label>
                <input
                  id="price"
                  type="number"
                  placeholder="0"
                  className={`input-field ${formErrors.price ? 'border-red-500' : ''}`}
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    if (formErrors.price) setFormErrors({ ...formErrors, price: '' })
                  }}
                />
                <FormError error={formErrors.price} />
              </div>
            </fieldset>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <h3 className="font-semibold mb-2 text-blue-900">📄 Documents par statut</h3>
              <p className="text-sm text-blue-700">À configurer après création dans l'onglet "Événements"</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">Statut</label>
              <select
                id="status"
                className="input-field"
                value={formData.status}
                onChange={(e) => {
                  const value = e.target.value
                  if (WORKSHOP_TYPE_STATUSES.includes(value as WorkshopTypeStatus)) {
                    setFormData({
                      ...formData,
                      status: value as WorkshopTypeStatus,
                    })
                  }
                }}
              >
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1" disabled={isSubmitting || loading}>
                {isSubmitting ? 'Traitement...' : editingId ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Ateliers configurés">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : types.length > 0 ? (
          <Table columns={columns} data={types} />
        ) : (
          <p className="text-gray-600 text-center py-8">Aucun atelier configuré pour le moment</p>
        )}
      </Card>

      {selectedType && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold text-blue-900 mb-2">✓ Atelier sélectionné: {selectedType.name}</h3>
          <p className="text-sm text-blue-700">
            Vous pouvez maintenant créer des événements datés pour cet atelier dans l'onglet "Événements"
          </p>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-900">
          💡 <strong>Flux de travail:</strong> Créez d'abord votre atelier (type, places, prix), puis allez à l'onglet "Événements" pour créer les dates et gérer l'agenda.
        </p>
      </div>

      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Supprimer cet atelier?"
        message="Cette action est irréversible. Tous les événements liés seront affectés."
        isDangerous
        isLoading={deleteConfirmLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}

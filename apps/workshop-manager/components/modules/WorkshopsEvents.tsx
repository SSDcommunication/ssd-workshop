'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useWorkshops, useWorkshopTypes } from '@/lib/hooks'
import { Workshop } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { validateWorkshopEvent, hasErrors } from '@/lib/validators'
import FormError from '../ui/FormError'
import ConfirmDialog from '../ui/ConfirmDialog'
import StatusBadge from '../ui/StatusBadge'
import { useToast } from '../ui/Toast/ToastContext'

const INITIAL_FORM_DATA = {
  name: '',
  date: '',
  status: 'planning' as 'planning' | 'active' | 'completed' | 'archived',
}

export default function WorkshopsEvents() {
  const { types } = useWorkshopTypes()
  const { workshops, loading, error, addWorkshop, deleteWorkshop } = useWorkshops()
  const { addToast } = useToast()

  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false)

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors({})
    setShowForm(false)
  }

  const selectedType = types.find((t) => t.id === selectedTypeId)
  const workshopsForType = selectedTypeId
    ? workshops.filter((w) => w.workshop_type_id === selectedTypeId)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTypeId) {
      addToast({
        type: 'info',
        message: 'Veuillez sélectionner un atelier',
        duration: 3000,
      })
      return
    }

    const errors = validateWorkshopEvent(formData)
    if (hasErrors(errors)) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
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

      addToast({
        type: 'success',
        message: 'Événement créé avec succès',
        duration: 3000,
      })
      resetForm()
    } catch (err) {
      addToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur lors de la création',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    setDeleteConfirmLoading(true)
    try {
      await deleteWorkshop(deleteConfirmId)
      addToast({
        type: 'success',
        message: 'Événement supprimé',
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
      render: (status: string) => <StatusBadge status={status} type="workshop" />,
    },
    { key: 'max_attendees', label: 'Places' },
    { key: 'price', label: 'Prix (€)' },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <a href={`/workshops/${id}`} className="text-[#4dd1e3] hover:underline text-sm" aria-label="Voir les détails">
            Détails
          </a>
          <a href={`/workshops/${id}/program`} className="text-[#4dd1e3] hover:underline text-sm" aria-label="Voir l'agenda">
            Agenda
          </a>
          <button
            onClick={() => setDeleteConfirmId(id)}
            className="text-red-600 hover:underline text-sm"
            aria-label="Supprimer cet événement"
          >
            Supprimer
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
            👉 <strong>Aucun atelier configuré</strong>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            Allez d'abord à l'onglet "Ateliers" pour créer un atelier, puis revenez ici.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestion des Événements</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Sélection de l'atelier */}
      <Card title="1️⃣ Sélectionnez un atelier" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label htmlFor="event-name" className="block text-sm font-medium mb-2">Nom de l'événement</label>
                  <input
                    id="event-name"
                    type="text"
                    placeholder={`Ex: ${selectedType.name} - Juillet 2026 - Paris`}
                    className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' })
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Incluez le lieu si plusieurs événements</p>
                  <FormError error={formErrors.name} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event-date" className="block text-sm font-medium mb-2">Date et Heure</label>
                    <input
                      id="event-date"
                      type="datetime-local"
                      className={`input-field ${formErrors.date ? 'border-red-500' : ''}`}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value })
                        if (formErrors.date) setFormErrors({ ...formErrors, date: '' })
                      }}
                    />
                    <FormError error={formErrors.date} />
                  </div>

                  <div>
                    <label htmlFor="event-status" className="block text-sm font-medium mb-2">Statut initial</label>
                    <select
                      id="event-status"
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

                <div className="flex flex-col sm:flex-row gap-2">
                  <button type="submit" className="btn-primary flex-1" disabled={isSubmitting || loading}>
                    {isSubmitting ? 'Création...' : '+ Créer l\'événement'}
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="Supprimer cet événement?"
        message="Cette action est irréversible. L'événement sera supprimé avec tous ses détails."
        isDangerous
        isLoading={deleteConfirmLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}

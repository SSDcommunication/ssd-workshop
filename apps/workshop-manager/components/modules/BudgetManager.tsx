'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import Table from '../ui/Table'
import { useBudget } from '@/lib/hooks'
import { useAttendees } from '@/lib/hooks'
import { Budget } from '@/types'

export default function BudgetManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { items, loading, error, addItem, updateItem, deleteItem } =
    useBudget(workshopId || undefined)
  const { attendees } = useAttendees(workshopId || undefined)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: 'Venue',
    item: '',
    estimated_cost: 0,
    actual_cost: 0,
    status: 'estimated' as const,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshopId) {
      alert('Sélectionnez un atelier')
      return
    }

    try {
      if (editingId) {
        await updateItem(editingId, formData)
        setEditingId(null)
      } else {
        await addItem({
          ...formData,
          workshop_id: workshopId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<Budget, 'id'>)
      }
      setFormData({
        category: 'Venue',
        item: '',
        estimated_cost: 0,
        actual_cost: 0,
        status: 'estimated',
        notes: '',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (budgetItem: Budget) => {
    setFormData({
      category: budgetItem.category,
      item: budgetItem.item,
      estimated_cost: budgetItem.estimated_cost,
      actual_cost: budgetItem.actual_cost || 0,
      status: budgetItem.status,
      notes: budgetItem.notes || '',
    })
    setEditingId(budgetItem.id)
    setShowForm(true)
  }

  const totalEstimated = items.reduce((sum, i) => sum + i.estimated_cost, 0)
  const totalActual = items.reduce((sum, i) => sum + (i.actual_cost || 0), 0)
  const totalRevenue = attendees.reduce((sum, a) => sum + a.amount_paid, 0)
  const profit = totalRevenue - totalActual
  const margin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0

  const columns = [
    { key: 'category', label: 'Catégorie' },
    { key: 'item', label: 'Article' },
    { key: 'estimated_cost', label: 'Estimé (€)' },
    { key: 'actual_cost', label: 'Réel (€)' },
    {
      key: 'status',
      label: 'Statut',
      render: (status: string) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === 'estimated'
              ? 'bg-gray-100 text-gray-800'
              : status === 'booked'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {status === 'estimated' ? 'Estimé' : status === 'booked' ? 'Réservé' : 'Payé'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => {
        const item = items.find((i) => i.id === id)
        return (
          <div className="flex gap-2">
            <button
              onClick={() => item && handleEdit(item)}
              className="text-[#4dd1e3] hover:underline text-sm"
            >
              Modifier
            </button>
            <button
              onClick={() => deleteItem(id).catch(() => alert('Erreur'))}
              className="text-red-600 hover:underline text-sm"
            >
              Supprimer
            </button>
          </div>
        )
      },
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
        <h1 className="text-4xl font-bold text-gray-900">Budget & P&L</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Ajouter dépense'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title={editingId ? 'Modifier dépense' : 'Ajouter dépense'} className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Catégorie"
                required
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <input
                type="text"
                placeholder="Article"
                required
                className="input-field"
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Coût estimé (€)"
                step="0.01"
                min="0"
                className="input-field"
                value={formData.estimated_cost}
                onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Coût réel (€)"
                step="0.01"
                min="0"
                className="input-field"
                value={formData.actual_cost}
                onChange={(e) => setFormData({ ...formData, actual_cost: parseFloat(e.target.value) })}
              />
            </div>
            <select
              className="input-field"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'estimated' | 'booked' | 'paid',
                })
              }
            >
              <option value="estimated">Estimé</option>
              <option value="booked">Réservé</option>
              <option value="paid">Payé</option>
            </select>
            <textarea
              placeholder="Notes"
              className="input-field"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sauvegarde...' : editingId ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm mb-2">Revenus</p>
          <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)}€</p>
          <p className="text-xs text-gray-500 mt-1">{attendees.length} inscrits</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Dépenses estimées</p>
          <p className="text-3xl font-bold text-orange-600">{totalEstimated.toFixed(2)}€</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Dépenses réelles</p>
          <p className="text-3xl font-bold text-red-600">{totalActual.toFixed(2)}€</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Profit net</p>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profit.toFixed(2)}€
          </p>
          <p className="text-xs text-gray-500 mt-1">Marge: {margin}%</p>
        </Card>
      </div>

      {/* Budget Comparison */}
      <Card title="Détails budget - Estimé vs Réel">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : items.length > 0 ? (
          <Table columns={columns} data={items} />
        ) : (
          <p className="text-gray-600 text-center py-8">Aucune dépense pour le moment</p>
        )}
      </Card>
    </div>
  )
}

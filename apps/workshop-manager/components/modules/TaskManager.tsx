'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import { useTasks } from '@/lib/hooks'
import { Task } from '@/types'

const CATEGORIES = [
  'logistique',
  'admin',
  'tech',
  'email',
  'design',
  'speakers',
  'marketing',
  'content',
]

export default function TaskManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks(
    workshopId || undefined
  )

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'tech' as const,
    assigned_to: '',
    priority: 'medium' as const,
    due_date: '',
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
        await updateTask(editingId, formData)
        setEditingId(null)
      } else {
        await addTask({
          ...formData,
          workshop_id: workshopId,
          status: 'todo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<Task, 'id'>)
      }
      setFormData({
        title: '',
        category: 'tech',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
        notes: '',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updates: Record<string, any> = { status: newStatus }
      if (newStatus === 'done') {
        updates.completed_date = new Date().toISOString()
      }
      await updateTask(taskId, updates)
    } catch (err) {
      alert('Erreur')
    }
  }

  const statuses = ['todo', 'in_progress', 'done']
  const priorities = { high: '🔴 Haute', medium: '🟡 Moyenne', low: '🟢 Basse' }

  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

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
        <h1 className="text-4xl font-bold text-gray-900">Tâches</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
          }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Créer une tâche'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title="Créer une tâche" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Titre"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as any,
                  })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Assigné à"
                className="input-field"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="input-field"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as any,
                  })
                }
              >
                <option value="low">🟢 Basse</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
              <input
                type="date"
                className="input-field"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Notes"
              className="input-field"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sauvegarde...' : 'Créer'}
            </button>
          </form>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">À faire</p>
          <p className="text-3xl font-bold">{columns.todo.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">En cours</p>
          <p className="text-3xl font-bold text-blue-600">{columns.in_progress.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Complétées</p>
          <p className="text-3xl font-bold text-green-600">{columns.done.length}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(columns).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4 min-h-96">
            <h2 className="font-bold text-gray-900 mb-4 capitalize">
              {status === 'todo' && '📝 À faire'}
              {status === 'in_progress' && '⏳ En cours'}
              {status === 'done' && '✅ Complétées'}
            </h2>

            <div className="space-y-3">
              {statusTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm flex-1">
                      {task.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded whitespace-nowrap ml-2">
                      {task.category}
                    </span>
                  </div>
                  {task.notes && <p className="text-xs text-gray-600 mb-3">{task.notes}</p>}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{task.assigned_to || '—'}</span>
                    <span className="text-xs">
                      {priorities[task.priority as keyof typeof priorities]}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {status !== 'done' && (
                      <button
                        onClick={() =>
                          handleStatusChange(
                            task.id,
                            status === 'todo' ? 'in_progress' : 'done'
                          )
                        }
                        className="text-xs bg-[#4dd1e3] text-white px-2 py-1 rounded hover:opacity-80 flex-1"
                      >
                        {status === 'todo' ? 'Démarrer' : 'Compléter'}
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id).catch(() => alert('Erreur'))}
                      className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

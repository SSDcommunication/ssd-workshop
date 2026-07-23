'use client'

import { useState } from 'react'
import Card from '../ui/Card'
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      workshop_id: '2',
      title: 'Créer la landing page',
      category: 'tech',
      assigned_to: 'Sophie',
      status: 'in_progress',
      priority: 'high',
      due_date: '2026-07-25',
      notes: 'Intégrer formulaire d\'inscription + Stripe',
      created_at: '2026-07-17',
      updated_at: '2026-07-17',
    },
  ])

  const statuses = ['todo', 'in_progress', 'done']
  const priorities = { high: '🔴 Haute', medium: '🟡 Moyenne', low: '🟢 Basse' }

  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as any } : t
      )
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Tâches</h1>
        <button className="btn-primary">+ Créer une tâche</button>
      </div>

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
                  className="bg-white rounded-lg p-4 border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                  draggable
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {task.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{task.notes}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {task.assigned_to}
                    </span>
                    <span className="text-xs">
                      {priorities[task.priority as keyof typeof priorities]}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {status !== 'in_progress' && (
                      <button
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            status === 'todo' ? 'in_progress' : 'done'
                          )
                        }
                        className="text-xs bg-[#4dd1e3] text-white px-2 py-1 rounded hover:opacity-80"
                      >
                        {status === 'todo' ? 'Démarrer' : 'Compléter'}
                      </button>
                    )}
                    {status === 'in_progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'done')}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:opacity-80"
                      >
                        Compléter
                      </button>
                    )}
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

'use client'

import { useEffect, useState } from 'react'
import Card from '../ui/Card'
import KPICard from '../ui/KPICard'
import Table from '../ui/Table'
import { Workshop, Attendee, Task } from '@/types'

export default function Dashboard() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAttendees: 0,
    confirmedAttendees: 0,
    pendingAttendees: 0,
    totalRevenue: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
  })

  useEffect(() => {
    fetchWorkshops()
  }, [])

  useEffect(() => {
    if (selectedWorkshop) {
      fetchStats(selectedWorkshop)
    }
  }, [selectedWorkshop])

  const fetchWorkshops = async () => {
    try {
      // À remplacer par un appel API réel
      const mockWorkshops: Workshop[] = [
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
      ]
      setWorkshops(mockWorkshops)
      setSelectedWorkshop(mockWorkshops[1]?.id || null)
    } catch (error) {
      console.error('Erreur lors du chargement des ateliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (workshopId: string) => {
    try {
      // À remplacer par un appel API réel
      setStats({
        totalAttendees: 8,
        confirmedAttendees: 6,
        pendingAttendees: 2,
        totalRevenue: 4800,
        tasksCompleted: 12,
        tasksTotal: 25,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>

        {/* Workshop Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un atelier
          </label>
          <select
            value={selectedWorkshop || ''}
            onChange={(e) => setSelectedWorkshop(e.target.value)}
            className="input-field"
          >
            <option value="">Choisir un atelier...</option>
            {workshops.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} - {ws.date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedWorkshop && (
        <>
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              label="Total inscrits"
              value={stats.totalAttendees}
              icon="👥"
            />
            <KPICard
              label="Confirmés"
              value={stats.confirmedAttendees}
              change={(stats.confirmedAttendees / stats.totalAttendees) * 100}
              icon="✅"
            />
            <KPICard
              label="En attente"
              value={stats.pendingAttendees}
              icon="⏳"
            />
            <KPICard
              label="Revenu total"
              value={`${stats.totalRevenue}€`}
              icon="💰"
            />
          </div>

          {/* Tasks Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Progression des tâches">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Complétées
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {Math.round((stats.tasksCompleted / stats.tasksTotal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#4dd1e3] h-2 rounded-full transition-all"
                      style={{
                        width: `${(stats.tasksCompleted / stats.tasksTotal) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {stats.tasksCompleted} / {stats.tasksTotal} tâches
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Actions rapides">
              <div className="space-y-3">
                <button className="btn-primary w-full">+ Ajouter un inscrit</button>
                <button className="btn-secondary w-full">+ Créer une tâche</button>
                <button className="btn-secondary w-full">
                  + Envoyer un email
                </button>
                <button className="btn-secondary w-full">+ Publier sur LinkedIn</button>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card title="Activité récente">
            <p className="text-gray-600">Aucune activité pour le moment</p>
          </Card>
        </>
      )}
    </div>
  )
}

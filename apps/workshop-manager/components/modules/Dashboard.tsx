'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Card from '../ui/Card'
import KPICard from '../ui/KPICard'
import { useWorkshops, useAttendees, useTasks, useEmailCampaigns, useSocialMedia } from '@/lib/hooks'

export default function Dashboard() {
  const { workshops, loading: wsLoading } = useWorkshops()
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null)

  const { attendees, loading: attLoading } = useAttendees(selectedWorkshop || undefined)
  const { tasks, loading: taskLoading } = useTasks(selectedWorkshop || undefined)
  const { campaigns, loading: emailLoading } = useEmailCampaigns(selectedWorkshop || undefined)
  const { posts, loading: socialLoading } = useSocialMedia(selectedWorkshop || undefined)

  useEffect(() => {
    if (workshops.length > 0 && !selectedWorkshop) {
      setSelectedWorkshop(workshops[0]?.id)
    }
  }, [workshops, selectedWorkshop])

  const currentWorkshop = workshops.find((w) => w.id === selectedWorkshop)
  const loading = wsLoading || attLoading || taskLoading || emailLoading || socialLoading

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
  }

  const emailStats = {
    total: campaigns.length,
    sent: campaigns.filter((c) => c.status === 'sent').length,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
  }

  const socialStats = {
    total: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>

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

      {selectedWorkshop && currentWorkshop && (
        <>
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              label="Total inscrits"
              value={attendees.length}
              icon="👥"
            />
            <KPICard
              label="Payés"
              value={attendees.filter((a) => a.payment_status === 'paid').length}
              change={attendees.length > 0 ? (attendees.filter((a) => a.payment_status === 'paid').length / attendees.length) * 100 : 0}
              icon="✅"
            />
            <KPICard
              label="Revenu total"
              value={`${attendees.reduce((sum, a) => sum + a.amount_paid, 0).toFixed(0)}€`}
              icon="💰"
            />
            <KPICard
              label="Statut atelier"
              value={currentWorkshop.status}
              icon={currentWorkshop.status === 'active' ? '🔴' : currentWorkshop.status === 'planning' ? '📋' : '✅'}
            />
          </div>

          {/* Content Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-gray-600 text-sm mb-1">Campagnes email</p>
              <p className="text-3xl font-bold mb-2">{emailStats.total}</p>
              <p className="text-xs text-gray-500">
                {emailStats.sent} envoyées • {emailStats.scheduled} planifiées
              </p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm mb-1">Posts sociaux</p>
              <p className="text-3xl font-bold mb-2">{socialStats.total}</p>
              <p className="text-xs text-gray-500">
                {socialStats.published} publiés
              </p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm mb-1">Tâches</p>
              <p className="text-3xl font-bold mb-2">{taskStats.total}</p>
              <p className="text-xs text-gray-500">
                {taskStats.completed} complétées • {taskStats.inProgress} en cours
              </p>
            </Card>
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
                      {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#4dd1e3] h-2 rounded-full transition-all"
                      style={{
                        width: `${taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {taskStats.completed} / {taskStats.total} tâches
                  </p>
                </div>
              </div>
            </Card>

            <Card title="Actions rapides">
              <div className="space-y-3">
                <Link
                  href={`/attendees?workshop_id=${selectedWorkshop}`}
                  className="btn-primary w-full block text-center"
                >
                  👥 Gérer inscrits
                </Link>
                <Link
                  href={`/tasks?workshop_id=${selectedWorkshop}`}
                  className="btn-secondary w-full block text-center"
                >
                  ✅ Gérer tâches
                </Link>
                <Link
                  href={`/email-campaigns?workshop_id=${selectedWorkshop}`}
                  className="btn-secondary w-full block text-center"
                >
                  ✉️ Gérer emails
                </Link>
                <Link
                  href={`/social-media?workshop_id=${selectedWorkshop}`}
                  className="btn-secondary w-full block text-center"
                >
                  📱 Gérer posts
                </Link>
              </div>
            </Card>
          </div>

          {/* Latest Registrations */}
          {attendees.length > 0 && (
            <Card title="Dernières inscriptions">
              <div className="space-y-3">
                {attendees.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{a.full_name}</p>
                      <p className="text-xs text-gray-600">{a.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        a.payment_status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {a.payment_status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

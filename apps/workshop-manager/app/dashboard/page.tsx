'use client'

import DashboardLayout from '@/components/ui/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Vue d'ensemble</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Types d'ateliers</p>
            <p className="text-3xl font-bold text-gray-900">9</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Ateliers</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Participants</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Événements</p>
            <p className="text-3xl font-bold text-gray-900">-</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

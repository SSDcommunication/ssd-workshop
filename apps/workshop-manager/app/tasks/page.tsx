'use client'
import DashboardLayout from '@/components/ui/DashboardLayout'
export default function TasksPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tâches</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Section Tâches en construction...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

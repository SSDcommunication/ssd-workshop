'use client'

import { useWorkshopTypes } from '@/lib/hooks'
import DashboardLayout from '@/components/ui/DashboardLayout'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { types, loading, error } = useWorkshopTypes()
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/workshop-types?page=1&limit=100')
      .then(r => r.json())
      .then(data => setApiData(data))
  }, [])

  return (
    <DashboardLayout>
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🐛 Debug Workshop Types</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border p-4 rounded bg-blue-50">
          <h2 className="font-bold mb-2">Hook State</h2>
          <p>Loading: {loading ? '✅ true' : '❌ false'}</p>
          <p>Error: {error ? `❌ ${error}` : '✅ null'}</p>
          <p className="text-2xl font-bold text-blue-600">Types count: {types.length}</p>
        </div>

        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-bold mb-2">API Response</h2>
          {apiData && (
            <>
              <p>Total Items: {apiData.totalItems}</p>
              <p className="text-2xl font-bold text-green-600">Items count: {apiData.items?.length || 0}</p>
            </>
          )}
        </div>
      </div>

      <div className="border p-4 rounded mb-6">
        <h2 className="font-bold mb-4">Types List ({types.length})</h2>
        {types.length === 0 ? (
          <p className="text-red-600">❌ NO TYPES LOADED!</p>
        ) : (
          <ul className="space-y-2">
            {types.map((t) => (
              <li key={t.id} className="p-2 bg-gray-100 rounded">
                <strong>{t.id}.</strong> {t.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border p-4 rounded">
        <h2 className="font-bold mb-4">API Items ({apiData?.items?.length || 0})</h2>
        {apiData?.items && (
          <ul className="space-y-2">
            {apiData.items.map((t: any) => (
              <li key={t.id} className="p-2 bg-gray-100 rounded">
                <strong>{t.id}.</strong> {t.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}

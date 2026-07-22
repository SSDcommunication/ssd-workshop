'use client'

import { useWorkshopTypes } from '@/lib/hooks'
import { useState, useEffect } from 'react'

export function DebugInfo() {
  const { types, loading, error } = useWorkshopTypes()
  const [apiRaw, setApiRaw] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    fetch('/api/workshop-types?page=1&limit=100')
      .then(r => r.json())
      .then(data => {
        console.log('DEBUG API RESPONSE:', data)
        setApiRaw(data)
      })
      .catch(e => console.error('DEBUG FETCH ERROR:', e))
  }, [])

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded z-50"
      >
        🐛 DEBUG ({types.length} types)
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded max-w-md max-h-96 overflow-y-auto z-50 border-2 border-red-500">
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-xl cursor-pointer"
      >
        ✕
      </button>

      <h3 className="font-bold text-red-400 mb-2">DEBUG</h3>

      <div className="text-xs space-y-1">
        <p><span className="text-yellow-400">Hook Loading:</span> {loading ? '✅' : '❌'}</p>
        <p><span className="text-yellow-400">Hook Error:</span> {error || 'none'}</p>
        <p><span className="text-yellow-400">Hook Types:</span> {types.length}</p>
        <p><span className="text-yellow-400">API Total:</span> {apiRaw?.totalItems || '?'}</p>
        <p><span className="text-yellow-400">API Items:</span> {apiRaw?.items?.length || 0}</p>

        {types.length === 0 && <p className="text-red-400 font-bold">❌ NO TYPES IN HOOK!</p>}

        {types.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-green-400">Types:</p>
            {types.map((t) => (
              <p key={t.id} className="text-green-300 truncate">
                {t.id}: {t.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

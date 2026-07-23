'use client'

import { useState, useEffect } from 'react'

export default function TestAPI() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/workshop-types')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        setData({ error: String(e) })
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Test API Direct</h1>
      <p className="mb-4">Loading: {loading ? 'true' : 'false'}</p>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-4xl">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

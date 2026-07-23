'use client'

import { useState } from 'react'

const workshops = [
  { name: 'Ikigai - Trouver ton pourquoi', slug: 'ikigai-pourquoi', description: 'Découvre ton Ikigai (passion + skills + valeurs + marché). L\'atelier fondateur pour construire une base solide. Durée: 2h', places_min: 5, places_ideal: 15, places_max: 25, price: 49, status: 'active' },
  { name: 'ICP - Identifier ton client idéal', slug: 'icp-client-ideal', description: 'Crée ton Ideal Customer Profile détaillé. Comprendre à qui tu vends pour vendre mieux. Durée: 2h', places_min: 5, places_ideal: 15, places_max: 25, price: 49, status: 'active' },
  { name: 'Rule of 1 - La spécialisation', slug: 'rule-of-1-specialisation', description: 'Maîtrise la stratégie Rule of 1 (1 client, 1 service, 1 prix, 1 canal). La simplicité avant tout. Durée: 1.5h', places_min: 5, places_ideal: 15, places_max: 25, price: 39, status: 'active' },
  { name: 'Messaging House - Construis ton message', slug: 'messaging-house-message', description: 'Structure ton message avec la Messaging House. Les fondations de ta communication. Durée: 2.5h', places_min: 5, places_ideal: 15, places_max: 25, price: 49, status: 'active' },
  { name: 'Brand Design - Crée ton identité', slug: 'brand-design-identite', description: 'Développe ton identité visuelle et verbale. Design, couleurs, typographie, tone of voice. Durée: 3h', places_min: 5, places_ideal: 15, places_max: 25, price: 59, status: 'active' },
  { name: 'Positionnement - Occupe ta place', slug: 'positionnement-marche', description: 'Positionne-toi clairement sur ton marché. Différenciation stratégique. Durée: 2h', places_min: 5, places_ideal: 15, places_max: 25, price: 49, status: 'active' },
  { name: 'Autorité Personnelle - Deviens expert', slug: 'autorite-personnelle-expert', description: 'Construis ton autorité personnelle. Stratégie de personal branding et leadership. Durée: 2h', places_min: 5, places_ideal: 15, places_max: 25, price: 49, status: 'active' },
  { name: 'Business in a Box - Ton modèle complet', slug: 'business-in-a-box-modele', description: 'Assemble tous les éléments dans ton Business in a Box. Le modèle complet. Durée: 2.5h', places_min: 5, places_ideal: 15, places_max: 25, price: 59, status: 'active' },
  { name: 'Construis ta marque - Pack complet', slug: 'construis-ta-marque-pack', description: 'Le pack complet: Ikigai + ICP + Rule of 1 + Messaging House + Brand Design + Positionnement + Autorité Personnelle + Business in a Box. 9 sessions intensives. Durée: 18h. Accès illimité à tous les ateliers.', places_min: 5, places_ideal: 20, places_max: 30, price: 299, status: 'active' },
]

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ success: string[]; errors: string[] }>({ success: [], errors: [] })

  const handleSeed = async () => {
    setLoading(true)
    setResults({ success: [], errors: [] })

    for (const workshop of workshops) {
      try {
        const res = await fetch('/api/workshop-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workshop),
        })

        const data = await res.json()

        if (res.ok && data.id) {
          setResults((prev) => ({
            ...prev,
            success: [...prev.success, `✅ ${workshop.name}`],
          }))
        } else {
          setResults((prev) => ({
            ...prev,
            errors: [...prev.errors, `❌ ${workshop.name}: ${data.error || 'Unknown error'}`],
          }))
        }
      } catch (error) {
        setResults((prev) => ({
          ...prev,
          errors: [...prev.errors, `❌ ${workshop.name}: ${error instanceof Error ? error.message : 'Error'}`],
        }))
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🌱 Seed Workshops</h1>
          <p className="text-gray-600 mb-8">Créer les 9 ateliers du parcours "Construis ta marque"</p>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-[#4dd1e3] hover:bg-[#3db5c6] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? '⏳ Création en cours...' : '🚀 Créer les 9 ateliers'}
          </button>

          {results.success.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-green-600 mb-4">Créés avec succès ({results.success.length})</h2>
              <div className="space-y-2">
                {results.success.map((msg, i) => (
                  <div key={i} className="text-green-700 text-sm">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.errors.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-red-600 mb-4">Erreurs ({results.errors.length})</h2>
              <div className="space-y-2">
                {results.errors.map((msg, i) => (
                  <div key={i} className="text-red-700 text-sm bg-red-50 p-2 rounded">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.success.length > 0 && results.errors.length === 0 && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800 font-semibold">✨ Tous les ateliers ont été créés avec succès!</p>
              <p className="text-green-700 text-sm mt-2">Retournez à <a href="/workshops" className="underline">Ateliers</a> pour voir la liste.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

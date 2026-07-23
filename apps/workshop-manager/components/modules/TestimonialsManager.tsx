'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import { useTestimonials } from '@/lib/hooks'
import { Testimonial } from '@/types'

export default function TestimonialsManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { testimonials, loading, error, addTestimonial, deleteTestimonial } =
    useTestimonials(workshopId || undefined)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    text: '',
    rating: 5,
    platform: '',
    link: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workshopId) {
      alert('Sélectionnez un atelier')
      return
    }

    try {
      await addTestimonial({
        ...formData,
        workshop_id: workshopId,
        received_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Omit<Testimonial, 'id'>)

      setFormData({
        first_name: '',
        last_name: '',
        text: '',
        rating: 5,
        platform: '',
        link: '',
        notes: '',
      })
      setShowForm(false)
    } catch (err) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : 0

  const ratingCounts = {
    5: testimonials.filter((t) => t.rating === 5).length,
    4: testimonials.filter((t) => t.rating === 4).length,
    3: testimonials.filter((t) => t.rating === 3).length,
    2: testimonials.filter((t) => t.rating === 2).length,
    1: testimonials.filter((t) => t.rating === 1).length,
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
        <h1 className="text-4xl font-bold text-gray-900">Témoignages</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Ajouter témoignage'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <Card title="Ajouter un témoignage" className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prénom"
                required
                className="input-field"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Nom"
                required
                className="input-field"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Témoignage"
              required
              className="input-field"
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-4">
              <select
                className="input-field"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
              <input
                type="text"
                placeholder="Plateforme (LinkedIn, etc)"
                className="input-field"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              />
              <input
                type="url"
                placeholder="Lien (optionnel)"
                className="input-field"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Notes internes"
              className="input-field"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Sauvegarde...' : 'Ajouter'}
            </button>
          </form>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm mb-2">Total témoignages</p>
          <p className="text-3xl font-bold">{testimonials.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Note moyenne</p>
          <p className="text-3xl font-bold text-yellow-500">{avgRating}⭐</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">5 étoiles</p>
          <p className="text-3xl font-bold text-green-600">{ratingCounts[5]}</p>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card title="Distribution des notes" className="mb-8">
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-4">
              <div className="w-20">
                <div className="flex gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div
                  className="bg-[#4dd1e3] h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${
                      testimonials.length > 0
                        ? (ratingCounts[rating as 1 | 2 | 3 | 4 | 5] / testimonials.length) * 100
                        : 0
                    }%`,
                  }}
                >
                  {ratingCounts[rating as 1 | 2 | 3 | 4 | 5] > 0
                    ? ratingCounts[rating as 1 | 2 | 3 | 4 | 5]
                    : ''}
                </div>
              </div>
              <div className="w-12 text-right">
                {ratingCounts[rating as 1 | 2 | 3 | 4 | 5]}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Testimonials List */}
      <Card title="Témoignages collectés">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border-l-4 border-[#4dd1e3] p-4 bg-gray-50 rounded"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.first_name} {testimonial.last_name}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <div>
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      {testimonial.platform && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {testimonial.platform}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTestimonial(testimonial.id).catch(() => alert('Erreur'))}
                    className="text-red-600 hover:underline text-sm"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 text-sm mb-2">{testimonial.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.received_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">Aucun témoignage pour le moment</p>
        )}
      </Card>
    </div>
  )
}

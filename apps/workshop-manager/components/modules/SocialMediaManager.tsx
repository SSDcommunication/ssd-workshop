'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Card from '../ui/Card'
import { useSocialMedia } from '@/lib/hooks'

export default function SocialMediaManager() {
  const searchParams = useSearchParams()
  const workshopId = searchParams.get('workshop_id') || ''

  const { posts, loading, error, updatePost, deletePost } = useSocialMedia(
    workshopId || undefined,
    'linkedin'
  )

  const [selectedPost, setSelectedPost] = useState<string | null>(null)

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
        <h1 className="text-4xl font-bold text-gray-900">Réseaux Sociaux</h1>
        <button className="btn-primary">+ Créer post</button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Total posts</p>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Publiés</p>
          <p className="text-3xl font-bold text-green-600">
            {posts.filter((p) => p.status === 'published').length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Engagement total</p>
          <p className="text-3xl font-bold text-blue-600">
            {posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0), 0)}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-600 text-sm mb-1">Partages</p>
          <p className="text-3xl font-bold">
            {posts.reduce((sum, p) => sum + (p.shares || 0), 0)}
          </p>
        </div>
      </div>

      {/* Calendar View */}
      <Card title="Calendrier de publication - LinkedIn (18 posts / 6 semaines)">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post.id)}
                className="border-l-4 border-[#4dd1e3] p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">🔗</span>
                      <p className="font-semibold text-gray-900 line-clamp-1">{post.subject_hook}</p>
                      <span
                        className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                          post.status === 'draft'
                            ? 'bg-gray-300 text-gray-800'
                            : post.status === 'scheduled'
                            ? 'bg-blue-300 text-blue-800'
                            : 'bg-green-300 text-green-800'
                        }`}
                      >
                        {post.status === 'draft'
                          ? 'Brouillon'
                          : post.status === 'scheduled'
                          ? 'Planifiée'
                          : 'Publiée'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.full_caption}</p>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>📅 {post.publication_date}</span>
                      <span>👁️ {post.content_type}</span>
                      <span>❤️ {post.likes} | 💬 {post.comments}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePost(post.id).catch(() => alert('Erreur'))
                    }}
                    className="text-red-600 hover:underline text-sm whitespace-nowrap ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selectedPost && (
        <Card title="Détails du post" className="mt-8">
          {posts.find((p) => p.id === selectedPost) && (
            <div className="space-y-4">
              {(() => {
                const post = posts.find((p) => p.id === selectedPost)!
                return (
                  <>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Accroche</p>
                      <p className="font-semibold text-lg">{post.subject_hook}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Caption</p>
                      <p className="bg-gray-100 p-3 rounded text-sm">{post.full_caption}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Hashtags</p>
                        <p className="font-semibold">{post.hashtags}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CTA</p>
                        <p className="font-semibold">{post.cta}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (post.status === 'draft') {
                            updatePost(post.id, { status: 'scheduled' })
                              .then(() => setSelectedPost(null))
                              .catch(() => alert('Erreur'))
                          }
                        }}
                        className="btn-primary flex-1"
                        disabled={post.status !== 'draft'}
                      >
                        {post.status === 'draft' ? 'Planifier' : 'Déjà ' + post.status}
                      </button>
                      <button
                        onClick={() => setSelectedPost(null)}
                        className="btn-secondary flex-1"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

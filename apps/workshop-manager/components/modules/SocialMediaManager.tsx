'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import { SocialMediaPost } from '@/types'

export default function SocialMediaManager() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([
    {
      id: '1',
      workshop_id: '2',
      platform: 'linkedin',
      content_type: 'static',
      publication_date: '2026-07-24',
      subject_hook: 'Un joli logo ne rapporte rien',
      full_caption:
        'Un joli logo ne rapporte rien. Un positionnement clair, oui...',
      hashtags: '#positionnement #identité #freelance',
      visual_direction: 'Portrait Sophie',
      cta: "S'inscrire",
      link: 'https://example.com/ssd-communication',
      status: 'draft',
      likes: 0,
      comments: 0,
      shares: 0,
      notes: 'Semaine 1 - Annonce',
      created_at: '2026-07-17',
      updated_at: '2026-07-17',
    },
  ])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Réseaux Sociaux</h1>
        <button className="btn-primary">+ Créer post</button>
      </div>

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
          <p className="text-gray-600 text-sm mb-1">Reach</p>
          <p className="text-3xl font-bold">--</p>
        </div>
      </div>

      {/* Calendar View */}
      <Card title="Calendrier de publication - LinkedIn (18 posts / 6 semaines)">
        <div className="space-y-4">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className="border-l-4 border-[#4dd1e3] p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{post.platform === 'linkedin' ? '🔗' : '📱'}</span>
                    <p className="font-semibold text-gray-900">{post.subject_hook}</p>
                    <span className={`px-2 py-1 text-xs rounded ${
                      post.status === 'draft'
                        ? 'bg-gray-300 text-gray-800'
                        : post.status === 'scheduled'
                        ? 'bg-blue-300 text-blue-800'
                        : 'bg-green-300 text-green-800'
                    }`}>
                      {post.status === 'draft' ? 'Brouillon' : post.status === 'scheduled' ? 'Planifiée' : 'Publiée'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{post.full_caption}</p>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>📅 {post.publication_date}</span>
                    <span>👁️ {post.content_type}</span>
                    <span>{post.hashtags}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#4dd1e3] hover:underline text-sm">Modifier</button>
                  <button className="text-orange-600 hover:underline text-sm">Publier</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

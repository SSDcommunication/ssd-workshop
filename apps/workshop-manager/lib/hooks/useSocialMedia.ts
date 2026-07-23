import { useState, useEffect } from 'react'
import { SocialMediaPost } from '@/types'

export function useSocialMedia(workshopId?: string, platform?: string) {
  const [posts, setPosts] = useState<SocialMediaPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const url = new URL('/api/social-media', window.location.origin)
        if (workshopId) url.searchParams.append('workshop_id', workshopId)
        if (platform) url.searchParams.append('platform', platform)
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error('Failed to fetch posts')
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [workshopId, platform])

  const addPost = async (post: Omit<SocialMediaPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const res = await fetch('/api/social-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      if (!res.ok) throw new Error('Failed to add post')
      const newPost = await res.json()
      setPosts([...posts, newPost])
      return newPost
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const updatePost = async (id: string, updates: Partial<SocialMediaPost>) => {
    try {
      const res = await fetch(`/api/social-media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update post')
      const updated = await res.json()
      setPosts(posts.map((p) => (p.id === id ? updated : p)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/social-media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete post')
      setPosts(posts.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    addPost,
    updatePost,
    deletePost,
  }
}

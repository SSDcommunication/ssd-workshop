import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createAdminClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const search = searchParams.get('search')?.trim() || ''

    const start = (page - 1) * limit
    const end = start + limit - 1

    // Construire la requête
    let query = supabase
      .from('workshop_types')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Appliquer la recherche si présente
    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    // Appliquer la pagination
    const { data, error, count } = await query.range(start, end)

    if (error) throw error

    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      items: data || [],
      totalItems,
      totalPages,
      page,
      limit,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('workshop_types')
      .insert([body])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

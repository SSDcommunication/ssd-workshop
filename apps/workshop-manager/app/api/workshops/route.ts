import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const search = searchParams.get('search')?.trim() || ''
    const workshopTypeId = searchParams.get('workshop_type_id')?.trim() || ''

    const start = (page - 1) * limit
    const end = start + limit - 1

    // Construire la requête
    let query = supabase
      .from('workshops')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })

    // Filtrer par type atelier si présent
    if (workshopTypeId) {
      query = query.eq('workshop_type_id', workshopTypeId)
    }

    // Appliquer la recherche si présente
    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    // Appliquer la pagination
    const { data, error, count } = await query.range(start, end)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('workshops')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

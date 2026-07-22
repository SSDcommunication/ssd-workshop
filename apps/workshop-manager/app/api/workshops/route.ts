import { NextRequest, NextResponse } from 'next/server'

const mockWorkshops = [
  {
    id: '1',
    workshop_type_id: '1',
    name: 'Ikigai - Session 1',
    slug: 'ikigai-session-1',
    date: '2025-02-01',
    time_start: '10:00',
    time_end: '12:00',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

async function createSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const search = searchParams.get('search')?.trim() || ''
    const workshopTypeId = searchParams.get('workshop_type_id')?.trim() || ''

    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('workshops')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })

    if (workshopTypeId) {
      query = query.eq('workshop_type_id', workshopTypeId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
    }

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
    // Fallback to mock data when Supabase is blocked
    let items = [...mockWorkshops]
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.trim() || ''
    const workshopTypeId = searchParams.get('workshop_type_id')?.trim() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))

    if (workshopTypeId) {
      items = items.filter(w => w.workshop_type_id === workshopTypeId)
    }

    if (search) {
      items = items.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.slug.toLowerCase().includes(search.toLowerCase())
      )
    }

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedItems = items.slice(start, end)
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      items: paginatedItems,
      totalItems,
      totalPages,
      page,
      limit,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('workshops')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

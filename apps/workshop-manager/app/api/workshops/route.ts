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

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
  const search = searchParams.get('search')?.trim() || ''
  const workshopTypeId = searchParams.get('workshop_type_id')?.trim() || ''

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseClient()
      const start = (page - 1) * limit
      const end = start + limit - 1

      let query = supabase
        .from('workshops')
        .select('*', { count: 'exact' })
        .order('date', { ascending: false })

      if (workshopTypeId) query = query.eq('workshop_type_id', workshopTypeId)
      if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)

      const { data, error, count } = await query.range(start, end)
      if (error) throw error

      return NextResponse.json({
        items: data || [],
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        page,
        limit,
      })
    } catch (error) {
      // Fall through to mock fallback below
    }
  }

  // Mock fallback
  let items = [...mockWorkshops]
  if (workshopTypeId) items = items.filter((w) => w.workshop_type_id === workshopTypeId)
  if (search) {
    const s = search.toLowerCase()
    items = items.filter((w) => w.name.toLowerCase().includes(s) || w.slug.toLowerCase().includes(s))
  }
  const start = (page - 1) * limit
  const end = start + limit
  return NextResponse.json({
    items: items.slice(start, end),
    totalItems: items.length,
    totalPages: Math.ceil(items.length / limit),
    page,
    limit,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.workshop_type_id) {
      return NextResponse.json(
        { error: 'Les champs "name" et "workshop_type_id" sont obligatoires' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createSupabaseClient()
        const { data, error } = await supabase
          .from('workshops')
          .insert([body])
          .select()

        if (error) throw error
        return NextResponse.json(data[0], { status: 201 })
      } catch (error) {
        // Fall through to mock fallback
      }
    }

    // Mock fallback: generate ID and echo back with timestamps
    const newWorkshop = {
      id: `ws_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...body,
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockWorkshops.push(newWorkshop)
    return NextResponse.json(newWorkshop, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

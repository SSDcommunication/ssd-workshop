import { NextRequest, NextResponse } from 'next/server'

// Direct Supabase client creation to bypass webpack issues
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

    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('workshop_types')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('workshop_types')
      .insert([body])
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

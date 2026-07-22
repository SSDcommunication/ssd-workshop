import { NextRequest, NextResponse } from 'next/server'

// Mock data for development (when Supabase is blocked by network policy)
const mockWorkshops = [
  {
    id: '1',
    name: 'Ikigai - Trouver ton pourquoi',
    slug: 'ikigai-pourquoi',
    description: 'Découvre ton Ikigai (passion + skills + valeurs + marché). L\'atelier fondateur pour construire une base solide. Durée: 2h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 49,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'ICP - Identifier ton client idéal',
    slug: 'icp-client-ideal',
    description: 'Crée ton Ideal Customer Profile détaillé. Comprendre à qui tu vends pour vendre mieux. Durée: 2h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 49,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Rule of 1 - La spécialisation',
    slug: 'rule-of-1-specialisation',
    description: 'Maîtrise la stratégie Rule of 1 (1 client, 1 service, 1 prix, 1 canal). La simplicité avant tout. Durée: 1.5h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 39,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Messaging House - Construis ton message',
    slug: 'messaging-house-message',
    description: 'Structure ton message avec la Messaging House. Les fondations de ta communication. Durée: 2.5h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 49,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Brand Design - Crée ton identité',
    slug: 'brand-design-identite',
    description: 'Développe ton identité visuelle et verbale. Design, couleurs, typographie, tone of voice. Durée: 3h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 59,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Positionnement - Occupe ta place',
    slug: 'positionnement-marche',
    description: 'Positionne-toi clairement sur ton marché. Différenciation stratégique. Durée: 2h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 49,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Autorité Personnelle - Deviens expert',
    slug: 'autorite-personnelle-expert',
    description: 'Construis ton autorité personnelle. Stratégie de personal branding et leadership. Durée: 2h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 49,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Business in a Box - Ton modèle complet',
    slug: 'business-in-a-box-modele',
    description: 'Assemble tous les éléments dans ton Business in a Box. Le modèle complet. Durée: 2.5h',
    places_min: 5,
    places_ideal: 15,
    places_max: 25,
    price: 59,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Construis ta marque - Pack complet',
    slug: 'construis-ta-marque-pack',
    description: 'Le pack complet: Ikigai + ICP + Rule of 1 + Messaging House + Brand Design + Positionnement + Autorité Personnelle + Business in a Box. 9 sessions intensives. Durée: 18h. Accès illimité à tous les ateliers.',
    places_min: 5,
    places_ideal: 20,
    places_max: 30,
    price: 299,
    status: 'active',
    documents_by_status: { en_construction: [], actif: [], archive: [] },
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
    // Fallback to mock data when Supabase is blocked
    let items = [...mockWorkshops]
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')?.trim() || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))

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

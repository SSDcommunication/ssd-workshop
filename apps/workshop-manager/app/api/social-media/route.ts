import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const workshopId = request.nextUrl.searchParams.get('workshop_id')
    const platform = request.nextUrl.searchParams.get('platform')

    let query = supabase.from('social_media_posts').select('*')

    if (workshopId) {
      query = query.eq('workshop_id', workshopId)
    }

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query.order('publication_date', {
      ascending: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
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
      .from('social_media_posts')
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

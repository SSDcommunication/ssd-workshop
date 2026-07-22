import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const workshops = body.workshops || []

    if (!Array.isArray(workshops) || workshops.length === 0) {
      return NextResponse.json(
        { error: 'workshops array is required and must not be empty' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('workshop_types')
      .insert(workshops)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: `✓ ${data.length} workshops created`, data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    )

    const workshops = [
      {
        name: 'Ikigai - Trouver ton pourquoi',
        slug: 'ikigai-pourquoi',
        description: 'Découvre ton Ikigai (passion + skills + valeurs + marché). L\'atelier fondateur pour construire une base solide. Durée: 2h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 49,
        status: 'active',
      },
      {
        name: 'ICP - Identifier ton client idéal',
        slug: 'icp-client-ideal',
        description: 'Crée ton Ideal Customer Profile détaillé. Comprendre à qui tu vends pour vendre mieux. Durée: 2h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 49,
        status: 'active',
      },
      {
        name: 'Rule of 1 - La spécialisation',
        slug: 'rule-of-1-specialisation',
        description: 'Maîtrise la stratégie Rule of 1 (1 client, 1 service, 1 prix, 1 canal). La simplicité avant tout. Durée: 1.5h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 39,
        status: 'active',
      },
      {
        name: 'Messaging House - Construis ton message',
        slug: 'messaging-house-message',
        description: 'Structure ton message avec la Messaging House. Les fondations de ta communication. Durée: 2.5h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 49,
        status: 'active',
      },
      {
        name: 'Brand Design - Crée ton identité',
        slug: 'brand-design-identite',
        description: 'Développe ton identité visuelle et verbale. Design, couleurs, typographie, tone of voice. Durée: 3h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 59,
        status: 'active',
      },
      {
        name: 'Positionnement - Occupe ta place',
        slug: 'positionnement-marche',
        description: 'Positionne-toi clairement sur ton marché. Différenciation stratégique. Durée: 2h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 49,
        status: 'active',
      },
      {
        name: 'Autorité Personnelle - Deviens expert',
        slug: 'autorite-personnelle-expert',
        description: 'Construis ton autorité personnelle. Stratégie de personal branding et leadership. Durée: 2h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 49,
        status: 'active',
      },
      {
        name: 'Business in a Box - Ton modèle complet',
        slug: 'business-in-a-box-modele',
        description: 'Assemble tous les éléments dans ton Business in a Box. Le modèle complet. Durée: 2.5h',
        places_min: 5,
        places_ideal: 15,
        places_max: 25,
        price: 59,
        status: 'active',
      },
      {
        name: 'Construis ta marque - Pack complet',
        slug: 'construis-ta-marque-pack',
        description: 'Le pack complet: Ikigai + ICP + Rule of 1 + Messaging House + Brand Design + Positionnement + Autorité Personnelle + Business in a Box. 9 sessions intensives. Durée: 18h',
        places_min: 5,
        places_ideal: 20,
        places_max: 30,
        price: 299,
        status: 'active',
      },
    ]

    const { data, error } = await supabase
      .from('workshop_types')
      .insert(workshops)
      .select()

    if (error) throw error

    return NextResponse.json(
      { message: `✓ ${data.length} ateliers créés`, data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

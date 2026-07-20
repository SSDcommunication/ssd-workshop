'use client'

import { WorkshopType, Workshop } from '@/types'

// Mock data - used for demo/testing without database
const MOCK_WORKSHOP_TYPES: WorkshopType[] = [
  {
    id: '1',
    name: 'IKIGAI',
    slug: 'ikigai',
    description: 'Trouvez votre positionnement unique et votre raison d\'être. Un atelier transformateur pour clarifier votre mission professionnelle.',
    places_min: 5,
    places_max: 30,
    places_ideal: 20,
    price: 49,
    documents_by_status: {
      en_construction: ['Syllabus IKIGAI', 'Guide préparation'],
      actif: ['Workbook participants', 'Slides présentation'],
      archive: ['Certificat', 'Récapitulatif'],
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Communication Assertive',
    slug: 'communication-assertive',
    description: 'Maîtrisez les techniques de communication directe et respectueuse pour des relations professionnelles plus saines.',
    places_min: 8,
    places_max: 25,
    places_ideal: 15,
    price: 39,
    documents_by_status: {
      en_construction: ['Plan cours', 'Exercices prépa'],
      actif: ['Fiches techniques', 'Cas pratiques'],
      archive: ['Attestation', 'Ressources bonus'],
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Personal Branding',
    slug: 'personal-branding',
    description: 'Construisez votre identité professionnelle distinctive et rayonnez sur votre marché.',
    places_min: 5,
    places_max: 20,
    places_ideal: 15,
    price: 59,
    documents_by_status: {
      en_construction: ['Audit personnel', 'Templates branding'],
      actif: ['Guide LinkedIn', 'Kit visuels'],
      archive: ['Portfolio', 'Blueprint personnel'],
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: '101',
    workshop_type_id: '1',
    name: 'IKIGAI - Juillet 2026 - Paris',
    slug: 'ikigai-juillet-2026-paris',
    description: 'Trouvez votre positionnement unique et votre raison d\'être. Un atelier transformateur pour clarifier votre mission professionnelle.',
    date: '2026-07-15T09:00:00Z',
    status: 'planning',
    max_attendees: 20,
    price: 49,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '102',
    workshop_type_id: '1',
    name: 'IKIGAI - Septembre 2026 - Lyon',
    slug: 'ikigai-septembre-2026-lyon',
    description: 'Trouvez votre positionnement unique et votre raison d\'être. Un atelier transformateur pour clarifier votre mission professionnelle.',
    date: '2026-09-20T14:00:00Z',
    status: 'active',
    max_attendees: 20,
    price: 49,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '103',
    workshop_type_id: '2',
    name: 'Communication Assertive - Août 2026',
    slug: 'communication-assertive-aout-2026',
    description: 'Maîtrisez les techniques de communication directe et respectueuse pour des relations professionnelles plus saines.',
    date: '2026-08-10T10:00:00Z',
    status: 'planning',
    max_attendees: 15,
    price: 39,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useMockWorkshopTypes() {
  return {
    types: MOCK_WORKSHOP_TYPES,
    loading: false,
    error: null,
    addType: async (type: Omit<WorkshopType, 'id'>) => {
      const newType = {
        ...type,
        id: String(Date.now()),
      }
      MOCK_WORKSHOP_TYPES.push(newType)
      return newType
    },
    updateType: async (id: string, updates: Partial<WorkshopType>) => {
      const index = MOCK_WORKSHOP_TYPES.findIndex(t => t.id === id)
      if (index >= 0) {
        MOCK_WORKSHOP_TYPES[index] = { ...MOCK_WORKSHOP_TYPES[index], ...updates }
      }
    },
    deleteType: async (id: string) => {
      const index = MOCK_WORKSHOP_TYPES.findIndex(t => t.id === id)
      if (index >= 0) {
        MOCK_WORKSHOP_TYPES.splice(index, 1)
      }
    },
    refetch: async () => {},
  }
}

export function useMockWorkshops() {
  return {
    workshops: MOCK_WORKSHOPS,
    loading: false,
    error: null,
    addWorkshop: async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>) => {
      const newWorkshop = {
        ...workshop,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      MOCK_WORKSHOPS.push(newWorkshop)
      return newWorkshop
    },
    updateWorkshop: async (id: string, updates: Partial<Workshop>) => {
      const index = MOCK_WORKSHOPS.findIndex(w => w.id === id)
      if (index >= 0) {
        MOCK_WORKSHOPS[index] = { ...MOCK_WORKSHOPS[index], ...updates }
      }
    },
    deleteWorkshop: async (id: string) => {
      const index = MOCK_WORKSHOPS.findIndex(w => w.id === id)
      if (index >= 0) {
        MOCK_WORKSHOPS.splice(index, 1)
      }
    },
  }
}

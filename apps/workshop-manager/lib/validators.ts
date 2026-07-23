export interface ValidationErrors {
  [key: string]: string
}

export function validateWorkshopType(formData: {
  name?: string
  slug?: string
  places_min?: number
  places_max?: number
  places_ideal?: number
  price?: number
  description?: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!formData.name?.trim()) {
    errors.name = 'Le nom est requis'
  } else if (formData.name.length > 100) {
    errors.name = 'Max 100 caractères'
  }

  if (!formData.slug?.trim()) {
    errors.slug = 'Le slug est requis'
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.slug = 'Slug invalide (minuscules, chiffres, tirets uniquement)'
  }

  if (!formData.places_min || formData.places_min < 1) {
    errors.places = 'Minimum >= 1'
  }

  if (!formData.places_max || formData.places_max < 1) {
    errors.places = 'Maximum >= 1'
  }

  if (formData.places_min && formData.places_max && formData.places_min > formData.places_max) {
    errors.places = 'Minimum doit être ≤ Maximum'
  }

  if (!formData.places_ideal || formData.places_ideal < 1) {
    errors.places = 'Idéal >= 1'
  }

  if (formData.places_ideal && formData.places_max && formData.places_ideal > formData.places_max) {
    errors.places = 'Idéal doit être ≤ Maximum'
  }

  if (!formData.price || formData.price < 0) {
    errors.price = 'Prix requis et >= 0'
  }

  if (formData.description && formData.description.length > 500) {
    errors.description = 'Max 500 caractères'
  }

  return errors
}

export function validateWorkshopEvent(formData: {
  name?: string
  date?: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!formData.name?.trim()) {
    errors.name = 'Le nom de l\'événement est requis'
  } else if (formData.name.length > 150) {
    errors.name = 'Max 150 caractères'
  }

  if (!formData.date) {
    errors.date = 'La date est requise'
  } else {
    const eventDate = new Date(formData.date)
    const now = new Date()
    if (eventDate < now) {
      errors.date = 'La date ne peut pas être dans le passé'
    }
  }

  return errors
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}

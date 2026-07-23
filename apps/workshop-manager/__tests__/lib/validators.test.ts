import { validateWorkshopType, validateWorkshopEvent, hasErrors } from '@/lib/validators'

describe('validateWorkshopType', () => {
  describe('name validation', () => {
    it('should reject empty name', () => {
      const errors = validateWorkshopType({ name: '' })
      expect(errors.name).toBeDefined()
      expect(errors.name).toBe('Le nom est requis')
    })

    it('should reject whitespace-only name', () => {
      const errors = validateWorkshopType({ name: '   ' })
      expect(errors.name).toBeDefined()
    })

    it('should accept valid name', () => {
      const errors = validateWorkshopType({ name: 'Test Workshop' })
      expect(errors.name).toBeUndefined()
    })

    it('should reject name exceeding 100 chars', () => {
      const longName = 'a'.repeat(101)
      const errors = validateWorkshopType({ name: longName })
      expect(errors.name).toBeDefined()
    })
  })

  describe('slug validation', () => {
    it('should reject empty slug', () => {
      const errors = validateWorkshopType({ slug: '' })
      expect(errors.slug).toBeDefined()
    })

    it('should reject invalid slug characters', () => {
      const errors = validateWorkshopType({ slug: 'Invalid Slug!' })
      expect(errors.slug).toBeDefined()
      expect(errors.slug).toContain('Slug invalide')
    })

    it('should accept valid slug', () => {
      const errors = validateWorkshopType({ slug: 'valid-slug-123' })
      expect(errors.slug).toBeUndefined()
    })
  })

  describe('places validation', () => {
    it('should reject places_min < 1', () => {
      const errors = validateWorkshopType({ places_min: 0 })
      expect(errors.places).toBeDefined()
    })

    it('should reject places_min > places_max', () => {
      const errors = validateWorkshopType({
        places_min: 30,
        places_max: 10,
      })
      expect(errors.places).toBeDefined()
      expect(errors.places).toContain('Minimum doit être ≤ Maximum')
    })

    it('should reject places_ideal > places_max', () => {
      const errors = validateWorkshopType({
        places_max: 20,
        places_ideal: 25,
      })
      expect(errors.places).toBeDefined()
      expect(errors.places).toContain('Idéal doit être ≤ Maximum')
    })

    it('should accept valid places configuration', () => {
      const errors = validateWorkshopType({
        places_min: 5,
        places_max: 30,
        places_ideal: 20,
      })
      expect(errors.places).toBeUndefined()
    })
  })

  describe('price validation', () => {
    it('should reject negative price', () => {
      const errors = validateWorkshopType({ price: -10 })
      expect(errors.price).toBeDefined()
    })

    it('should accept zero price', () => {
      const errors = validateWorkshopType({ price: 0 })
      expect(errors.price).toBeUndefined()
    })

    it('should accept positive price', () => {
      const errors = validateWorkshopType({ price: 49.99 })
      expect(errors.price).toBeUndefined()
    })
  })

  describe('description validation', () => {
    it('should reject description exceeding 500 chars', () => {
      const longDesc = 'a'.repeat(501)
      const errors = validateWorkshopType({ description: longDesc })
      expect(errors.description).toBeDefined()
    })

    it('should accept valid description', () => {
      const errors = validateWorkshopType({
        description: 'A valid workshop description',
      })
      expect(errors.description).toBeUndefined()
    })
  })
})

describe('validateWorkshopEvent', () => {
  describe('name validation', () => {
    it('should reject empty name', () => {
      const errors = validateWorkshopEvent({ name: '' })
      expect(errors.name).toBeDefined()
    })

    it('should accept valid name', () => {
      const errors = validateWorkshopEvent({ name: 'Workshop Event' })
      expect(errors.name).toBeUndefined()
    })

    it('should reject name exceeding 150 chars', () => {
      const longName = 'a'.repeat(151)
      const errors = validateWorkshopEvent({ name: longName })
      expect(errors.name).toBeDefined()
    })
  })

  describe('date validation', () => {
    it('should reject empty date', () => {
      const errors = validateWorkshopEvent({ date: '' })
      expect(errors.date).toBeDefined()
    })

    it('should reject past date', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const errors = validateWorkshopEvent({ date: pastDate })
      expect(errors.date).toBeDefined()
      expect(errors.date).toContain('ne peut pas être dans le passé')
    })

    it('should accept future date', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      const errors = validateWorkshopEvent({ date: futureDate })
      expect(errors.date).toBeUndefined()
    })
  })
})

describe('hasErrors', () => {
  it('should return true when errors exist', () => {
    const errors = { name: 'Name is required', date: 'Date is required' }
    expect(hasErrors(errors)).toBe(true)
  })

  it('should return false when no errors', () => {
    expect(hasErrors({})).toBe(false)
  })
})

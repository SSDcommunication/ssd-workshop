export const WORKSHOP_TYPE_STATUSES = ['active', 'archived'] as const
export type WorkshopTypeStatus = typeof WORKSHOP_TYPE_STATUSES[number]

export const WORKSHOP_STATUSES = ['planning', 'active', 'completed', 'archived'] as const
export type WorkshopStatus = typeof WORKSHOP_STATUSES[number]

export const TASK_CATEGORIES = [
  'logistique',
  'admin',
  'tech',
  'email',
  'design',
  'speakers',
  'marketing',
  'content',
] as const
export type TaskCategory = typeof TASK_CATEGORIES[number]

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = typeof TASK_STATUSES[number]

export const PAYMENT_STATUSES = ['pending', 'paid', 'refunded'] as const
export type PaymentStatus = typeof PAYMENT_STATUSES[number]

export const SOCIAL_PLATFORMS = ['linkedin', 'instagram', 'facebook', 'twitter'] as const
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number]

export const EMAIL_CAMPAIGN_STATUSES = ['draft', 'scheduled', 'sent'] as const
export type EmailCampaignStatus = typeof EMAIL_CAMPAIGN_STATUSES[number]

export const OUTREACH_STATUSES = ['new', 'contacted', 'replied', 'closed'] as const
export type OutreachStatus = typeof OUTREACH_STATUSES[number]
// Build timestamp: 1784832567
// Deployment timestamp: Thu Jul 23 18:49:32 UTC 2026

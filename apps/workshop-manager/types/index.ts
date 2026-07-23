export type Workshop = {
  id: string
  name: string
  slug: string
  description?: string
  date: string
  status: 'planning' | 'active' | 'completed' | 'archived'
  max_attendees: number
  price: number
  created_at: string
  updated_at: string
}

export type Attendee = {
  id: string
  workshop_id: string
  full_name: string
  email: string
  phone?: string
  country?: string
  city?: string
  ticket_type: string
  payment_status: 'pending' | 'paid' | 'refunded'
  amount_paid: number
  registration_date: string
  notes?: string
  synced_to_crm: boolean
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  workshop_id: string
  title: string
  category: 'logistique' | 'admin' | 'tech' | 'email' | 'design' | 'speakers' | 'marketing' | 'content'
  assigned_to?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'high' | 'medium' | 'low'
  due_date: string
  completed_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type WorkshopProgram = {
  id: string
  workshop_id: string
  start_time: string
  end_time: string
  duration_minutes: number
  session_title: string
  speaker: string
  format: string
  materials_needed?: string
  room_platform: string
  notes?: string
  created_at: string
  updated_at: string
}

export type SocialMediaPost = {
  id: string
  workshop_id: string
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter'
  content_type: 'static' | 'carousel' | 'video' | 'story'
  publication_date: string
  subject_hook: string
  full_caption: string
  hashtags?: string
  visual_direction?: string
  cta: string
  link?: string
  status: 'draft' | 'scheduled' | 'published'
  likes?: number
  comments?: number
  shares?: number
  notes?: string
  created_at: string
  updated_at: string
}

export type EmailCampaign = {
  id: string
  workshop_id: string
  subject: string
  target_segment: string
  send_date: string
  status: 'draft' | 'scheduled' | 'sent'
  sent_count?: number
  opened_count?: number
  clicked_count?: number
  unsubscribed_count?: number
  open_rate?: number
  click_rate?: number
  cta: string
  notes?: string
  created_at: string
  updated_at: string
}

export type Budget = {
  id: string
  workshop_id: string
  category: string
  item: string
  estimated_cost: number
  actual_cost?: number
  status: 'estimated' | 'booked' | 'paid'
  notes?: string
  created_at: string
  updated_at: string
}

export type Testimonial = {
  id: string
  workshop_id: string
  first_name: string
  last_name: string
  text: string
  rating: number
  platform: string
  link?: string
  received_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export type OutreachContact = {
  id: string
  workshop_id: string
  organization_name: string
  contact_type: string
  contact_person: string
  email: string
  phone_linkedin?: string
  status: 'new' | 'contacted' | 'replied' | 'closed'
  contact_date: string
  response?: string
  followup_date?: string
  result_notes?: string
  created_at: string
  updated_at: string
}

export type LandingPage = {
  id: string
  workshop_id: string
  url: string
  seo_title: string
  meta_description: string
  funnel_name: string
  domain: string
  hero_title: string
  hero_subtitle: string
  hero_cta: string
  conversion_rate?: number
  last_updated: string
  created_at: string
  updated_at: string
}

export type DashboardKPI = {
  total_attendees: number
  confirmed_attendees: number
  pending_attendees: number
  emails_sent: number
  email_open_rate: number
  tasks_completed_percentage: number
  total_ad_spend: number
  total_impressions: number
  total_clicks: number
  total_conversions: number
  avg_ctr: number
  avg_cpa: number
  total_revenue: number
}

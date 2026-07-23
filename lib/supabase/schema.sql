-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workshop Types Table (must be created BEFORE workshops table due to foreign key)
CREATE TABLE IF NOT EXISTS public.workshop_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  places_min INTEGER NOT NULL DEFAULT 1,
  places_max INTEGER NOT NULL DEFAULT 50,
  places_ideal INTEGER NOT NULL DEFAULT 25,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  documents_by_status JSONB DEFAULT '{"en_construction": [], "actif": [], "archive": []}',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workshops Table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_type_id UUID NOT NULL REFERENCES public.workshop_types(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'archived')),
  max_attendees INTEGER NOT NULL DEFAULT 25,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  visibility VARCHAR(50) NOT NULL DEFAULT 'participants' CHECK (visibility IN ('me', 'participants')),
  ticket_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  send_to_all BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendees Table
CREATE TABLE IF NOT EXISTS public.attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  ticket_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'registered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to VARCHAR(255),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  content TEXT,
  recipient_type VARCHAR(50) DEFAULT 'all',
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Media Posts Table
CREATE TABLE IF NOT EXISTS public.social_media_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  status VARCHAR(50) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budget Table
CREATE TABLE IF NOT EXISTS public.budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  attendee_name VARCHAR(255) NOT NULL,
  attendee_email VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Outreach Table
CREATE TABLE IF NOT EXISTS public.outreach (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  target_name VARCHAR(255) NOT NULL,
  target_email VARCHAR(255),
  contact_method VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workshop Program Table
CREATE TABLE IF NOT EXISTS public.workshop_program (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  time_slot TIME NOT NULL,
  activity VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  speaker VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Landing Page Table
CREATE TABLE IF NOT EXISTS public.landing_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  hero_image_url TEXT,
  cta_button_text VARCHAR(100),
  cta_button_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workshops_workshop_type_id ON public.workshops(workshop_type_id);
CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops(status);
CREATE INDEX IF NOT EXISTS idx_documents_workshop_id ON public.documents(workshop_id);
CREATE INDEX IF NOT EXISTS idx_attendees_workshop_id ON public.attendees(workshop_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workshop_id ON public.tasks(workshop_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_workshop_id ON public.email_campaigns(workshop_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_workshop_id ON public.social_media_posts(workshop_id);
CREATE INDEX IF NOT EXISTS idx_budget_workshop_id ON public.budget(workshop_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_workshop_id ON public.testimonials(workshop_id);
CREATE INDEX IF NOT EXISTS idx_outreach_workshop_id ON public.outreach(workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_program_workshop_id ON public.workshop_program(workshop_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_workshop_id ON public.landing_page(workshop_id);

-- Enable Row Level Security
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic: all authenticated users can access all data)
-- You can refine these policies later based on your security requirements

CREATE POLICY "Allow authenticated users to read workshop_types" ON public.workshop_types
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read workshops" ON public.workshops
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read documents" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read attendees" ON public.attendees
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read tasks" ON public.tasks
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read email_campaigns" ON public.email_campaigns
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read social_media_posts" ON public.social_media_posts
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read budget" ON public.budget
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read testimonials" ON public.testimonials
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read outreach" ON public.outreach
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read workshop_program" ON public.workshop_program
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to read landing_page" ON public.landing_page
  FOR SELECT USING (auth.role() = 'authenticated_user');

-- Add write policies for workshop_types
CREATE POLICY "Allow authenticated users to insert workshop_types" ON public.workshop_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update workshop_types" ON public.workshop_types
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete workshop_types" ON public.workshop_types
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for workshops
CREATE POLICY "Allow authenticated users to insert workshops" ON public.workshops
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update workshops" ON public.workshops
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete workshops" ON public.workshops
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for documents
CREATE POLICY "Allow authenticated users to insert documents" ON public.documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update documents" ON public.documents
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete documents" ON public.documents
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for attendees
CREATE POLICY "Allow authenticated users to insert attendees" ON public.attendees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update attendees" ON public.attendees
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete attendees" ON public.attendees
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for tasks
CREATE POLICY "Allow authenticated users to insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update tasks" ON public.tasks
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete tasks" ON public.tasks
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for email_campaigns
CREATE POLICY "Allow authenticated users to insert email_campaigns" ON public.email_campaigns
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update email_campaigns" ON public.email_campaigns
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete email_campaigns" ON public.email_campaigns
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for social_media_posts
CREATE POLICY "Allow authenticated users to insert social_media_posts" ON public.social_media_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update social_media_posts" ON public.social_media_posts
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete social_media_posts" ON public.social_media_posts
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for budget
CREATE POLICY "Allow authenticated users to insert budget" ON public.budget
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update budget" ON public.budget
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete budget" ON public.budget
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for testimonials
CREATE POLICY "Allow authenticated users to insert testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update testimonials" ON public.testimonials
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete testimonials" ON public.testimonials
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for outreach
CREATE POLICY "Allow authenticated users to insert outreach" ON public.outreach
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update outreach" ON public.outreach
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete outreach" ON public.outreach
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for workshop_program
CREATE POLICY "Allow authenticated users to insert workshop_program" ON public.workshop_program
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update workshop_program" ON public.workshop_program
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete workshop_program" ON public.workshop_program
  FOR DELETE USING (auth.role() = 'authenticated_user');

-- Add write policies for landing_page
CREATE POLICY "Allow authenticated users to insert landing_page" ON public.landing_page
  FOR INSERT WITH CHECK (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to update landing_page" ON public.landing_page
  FOR UPDATE USING (auth.role() = 'authenticated_user');

CREATE POLICY "Allow authenticated users to delete landing_page" ON public.landing_page
  FOR DELETE USING (auth.role() = 'authenticated_user');

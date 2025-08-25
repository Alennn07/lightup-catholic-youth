-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  max_attendees INTEGER NOT NULL DEFAULT 100,
  attendees INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  requirements TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  age INTEGER NOT NULL,
  parish VARCHAR(255) NOT NULL,
  diocese VARCHAR(255) NOT NULL,
  emergency_contact VARCHAR(255) NOT NULL,
  dietary_restrictions TEXT,
  special_needs TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  agree_to_photo_release BOOLEAN NOT NULL DEFAULT false,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_owner_id ON events(owner_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- Create unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_event_user ON event_registrations(event_id, user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
-- Anyone can read active events
CREATE POLICY "Anyone can read active events" ON events
  FOR SELECT USING (is_active = true);

-- Only authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only event owners can update their events
CREATE POLICY "Event owners can update events" ON events
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only event owners can delete their events
CREATE POLICY "Event owners can delete events" ON events
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for event_registrations table
-- Users can read their own registrations
CREATE POLICY "Users can read their own registrations" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

-- Event owners can read registrations for their events
CREATE POLICY "Event owners can read event registrations" ON event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_registrations.event_id 
      AND events.owner_id = auth.uid()
    )
  );

-- Authenticated users can create registrations
CREATE POLICY "Authenticated users can create registrations" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations
CREATE POLICY "Users can update their own registrations" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own registrations
CREATE POLICY "Users can delete their own registrations" ON event_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- Event owners can delete registrations for their events
CREATE POLICY "Event owners can delete event registrations" ON event_registrations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_registrations.event_id 
      AND events.owner_id = auth.uid()
    )
  );

-- Insert sample events data
INSERT INTO events (title, type, date, location, max_attendees, description, requirements, contact_email, contact_phone, owner_id, owner_email) VALUES
(
  'National Catholic Youth Conference',
  'Conference',
  '2024-12-15',
  'Indianapolis, IN',
  100,
  'Join thousands of Catholic youth for an inspiring weekend of faith, fellowship, and fun!',
  'Ages 14-18, parental consent required',
  'conference@lightup.com',
  '(555) 123-4567',
  (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
  'admin@lightup.com'
),
(
  'Advent Prayer Retreat',
  'Retreat',
  '2024-12-08',
  'Local Parish',
  50,
  'A day of prayer, reflection, and preparation for the coming of Christ',
  'All ages welcome, bring your own lunch',
  'retreat@lightup.com',
  '(555) 234-5678',
  (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
  'admin@lightup.com'
),
(
  'Christmas Caroling',
  'Service',
  '2024-12-24',
  'Nursing Home',
  30,
  'Spread Christmas joy by singing carols at the local nursing home',
  'All ages welcome, warm clothing recommended',
  'caroling@lightup.com',
  '(555) 345-6789',
  (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
  'admin@lightup.com'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

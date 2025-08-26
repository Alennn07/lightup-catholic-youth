-- Prayer Wall Database Setup for LightUp Catholic Youth Platform
-- This script creates the prayer_requests table and related structures

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  request TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  prayer_count INTEGER NOT NULL DEFAULT 0,
  is_answered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_id ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category ON prayer_requests(category);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_is_anonymous ON prayer_requests(is_anonymous);

-- Enable Row Level Security (RLS)
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayer_requests table
-- Anyone can read prayer requests (for the wall)
CREATE POLICY "Anyone can read prayer requests" ON prayer_requests
  FOR SELECT USING (true);

-- Authenticated users can create prayer requests
CREATE POLICY "Authenticated users can create prayer requests" ON prayer_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own prayer requests
CREATE POLICY "Users can update their own prayer requests" ON prayer_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own prayer requests
CREATE POLICY "Users can delete their own prayer requests" ON prayer_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_prayer_requests_updated_at 
  BEFORE UPDATE ON prayer_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample prayer requests for testing
INSERT INTO prayer_requests (user_id, name, request, category, is_anonymous, prayer_count) VALUES
  (
    (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
    'Maria',
    'Please pray for my grandmother who is in the hospital. She needs strength and healing.',
    'Health',
    false,
    3
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
    'Anonymous',
    'Praying for peace in our community and for all youth to find their faith journey.',
    'Spiritual',
    true,
    7
  ),
  (
    (SELECT id FROM auth.users WHERE email = 'admin@lightup.com' LIMIT 1),
    'John',
    'Please pray for my family as we go through a difficult time. We need guidance and hope.',
    'Family',
    false,
    5
  )
ON CONFLICT DO NOTHING;

-- Display sample data
SELECT 
  id,
  name,
  category,
  is_anonymous,
  prayer_count,
  created_at
FROM prayer_requests 
ORDER BY created_at DESC;

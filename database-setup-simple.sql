-- Run this SQL in your Supabase Dashboard SQL Editor
-- This script only creates what's missing (avoids duplicate policy errors)

-- First, check if the table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Low - General question',
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_category ON contact_submissions(category);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Allow public contact form submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contact submissions" ON contact_submissions;

-- Create policies
CREATE POLICY "Allow public contact form submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update contact submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp (safe to recreate)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Test the table with a sample record (only if table is empty)
INSERT INTO contact_submissions (name, email, priority, message, category) 
SELECT 'Test User', 'test@example.com', 'High - Urgent issue', 'This is a test message to verify the table works correctly.', 'technical'
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions LIMIT 1);

-- Verify the table was created and populated
SELECT 
  id,
  name,
  email,
  priority,
  category,
  status,
  created_at
FROM contact_submissions 
ORDER BY created_at DESC;

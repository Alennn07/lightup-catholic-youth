-- Test script to verify contact form database is working
-- Run this after the main setup to test the contact form

-- 1. Check if table exists and has correct structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'contact_submissions' 
ORDER BY ordinal_position;

-- 2. Check if policies are set up correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- 3. Test inserting a sample contact form submission
INSERT INTO contact_submissions (name, email, priority, message, category) 
VALUES (
  'John Doe', 
  'john.doe@example.com', 
  'Medium - Need assistance', 
  'I need help with my account login. I keep getting an error message when I try to sign in.', 
  'account'
);

-- 4. Verify the data was inserted
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

-- 5. Test updating the status (simulating admin action)
UPDATE contact_submissions 
SET status = 'in_progress' 
WHERE email = 'john.doe@example.com';

-- 6. Verify the update worked
SELECT 
  id,
  name,
  email,
  status,
  updated_at
FROM contact_submissions 
WHERE email = 'john.doe@example.com';

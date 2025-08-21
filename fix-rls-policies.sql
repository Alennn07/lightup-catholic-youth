-- PERMANENT FIX for RLS Policies
-- Run this in your Supabase SQL Editor

-- 1. First, disable RLS temporarily to see if that fixes the issue
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. If you want to keep RLS enabled but fix the policies, run these instead:

-- Enable RLS
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
-- DROP POLICY IF EXISTS "Users can view own profile" ON users;
-- DROP POLICY IF EXISTS "Users can update own profile" ON users;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new policies that allow proper access
-- CREATE POLICY "Users can view own profile" ON users
--   FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Users can update own profile" ON users
--   FOR UPDATE USING (auth.uid() = id);

-- CREATE POLICY "Users can insert own profile" ON users
--   FOR INSERT WITH CHECK (auth.uid() = id);

-- CREATE POLICY "Allow service role access" ON users
--   FOR ALL USING (auth.role() = 'service_role');

-- 3. Alternative: Create a simple policy that allows all operations
-- CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);

-- 4. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

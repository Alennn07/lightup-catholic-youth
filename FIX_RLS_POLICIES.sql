-- Fix RLS Policies for User Registration
-- Run this in your Supabase SQL Editor

-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create a policy that allows new users to insert their profile during registration
CREATE POLICY "Allow user profile creation during registration" ON users
FOR INSERT 
WITH CHECK (true); -- This allows any authenticated user to create a profile

-- Create a policy that allows users to view their own profile
CREATE POLICY "Users can view their own profile" ON users
FOR SELECT 
USING (auth.uid() = id);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a policy that allows users to delete their own profile
CREATE POLICY "Users can delete their own profile" ON users
FOR DELETE 
USING (auth.uid() = id);

-- Alternative: If you want to be more restrictive, use this instead:
-- CREATE POLICY "Allow user profile creation during registration" ON users
-- FOR INSERT 
-- WITH CHECK (auth.uid() = id);

-- Enable RLS on the users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

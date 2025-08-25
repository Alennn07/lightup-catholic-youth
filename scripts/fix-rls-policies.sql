-- Fix RLS policies for event_registrations table
-- This script will allow authenticated users to insert registrations

-- First, let's see what policies exist
SELECT * FROM pg_policies WHERE tablename = 'event_registrations';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can view their own registrations" ON event_registrations;
DROP POLICY IF EXISTS "Event owners can view all registrations" ON event_registrations;

-- Create new policies that allow proper access

-- Policy 1: Allow authenticated users to insert registrations
CREATE POLICY "Users can insert their own registrations" ON event_registrations
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow users to view their own registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy 3: Allow event owners to view all registrations for their events
CREATE POLICY "Event owners can view all registrations" ON event_registrations
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_registrations.event_id 
            AND events.owner_id = auth.uid()
        )
    );

-- Policy 4: Allow users to update their own registrations
CREATE POLICY "Users can update their own registrations" ON event_registrations
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy 5: Allow users to delete their own registrations
CREATE POLICY "Users can delete their own registrations" ON event_registrations
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'event_registrations';

-- Test the policies by checking if they're working
-- This should return the policies we just created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'event_registrations';

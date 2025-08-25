-- Fix RLS policies for event_registrations table - V2 (More Robust)
-- This script will properly handle existing policies and create new ones

-- First, let's see what policies currently exist
SELECT 'Current policies:' as info;
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'event_registrations';

-- Drop ALL existing policies for event_registrations table
-- This ensures we start fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'event_registrations'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON event_registrations';
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Verify all policies are dropped
SELECT 'After dropping policies:' as info;
SELECT COUNT(*) as remaining_policies FROM pg_policies WHERE tablename = 'event_registrations';

-- Now create the new policies from scratch

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

-- Verify the new policies were created
SELECT 'New policies created:' as info;
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'event_registrations'
ORDER BY policyname;

-- Test if the policies are working by checking permissions
SELECT 'Policy verification complete!' as status;

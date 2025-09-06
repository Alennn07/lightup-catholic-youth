-- Fix Youth Groups Database Schema
-- This script adds missing columns that the API routes expect

-- 1. Add owner_id column to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- 2. Add missing columns to group_members table
ALTER TABLE group_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS can_manage_members BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_create_events BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_create_posts BOOLEAN DEFAULT false;

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_owner_id ON youth_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members(group_id, status);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(group_id, role);

-- 4. Update existing records to have default values
UPDATE youth_groups SET owner_id = (
  SELECT user_id FROM group_members 
  WHERE group_id = youth_groups.id 
  ORDER BY joined_at ASC 
  LIMIT 1
) WHERE owner_id IS NULL;

-- 5. Set all existing members to active status
UPDATE group_members SET status = 'active' WHERE status IS NULL;

-- 6. Enable RLS on youth_groups if not already enabled
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for youth_groups
DROP POLICY IF EXISTS "Users can view public groups" ON youth_groups;
CREATE POLICY "Users can view public groups" ON youth_groups
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Group owners can manage their groups" ON youth_groups;
CREATE POLICY "Group owners can manage their groups" ON youth_groups
  FOR ALL USING (owner_id = auth.uid());

-- 8. Create RLS policies for group_members
DROP POLICY IF EXISTS "Users can view group members" ON group_members;
CREATE POLICY "Users can view group members" ON group_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_members.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Group owners can manage members" ON group_members;
CREATE POLICY "Group owners can manage members" ON group_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_members.group_id 
      AND owner_id = auth.uid()
    )
  );

-- 9. Create RLS policies for group_events
DROP POLICY IF EXISTS "Group members can view events" ON group_events;
CREATE POLICY "Group members can view events" ON group_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_events.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Group owners can create events" ON group_events;
CREATE POLICY "Group owners can create events" ON group_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_events.group_id 
      AND owner_id = auth.uid()
    )
  );

-- 10. Create RLS policies for group_posts
DROP POLICY IF EXISTS "Group members can view posts" ON group_posts;
CREATE POLICY "Group members can view posts" ON group_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "Group members can create posts" ON group_posts;
CREATE POLICY "Group members can create posts" ON group_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

-- 11. Verify the changes
SELECT 'youth_groups columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'youth_groups' 
ORDER BY ordinal_position;

SELECT 'group_members columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'group_members' 
ORDER BY ordinal_position;

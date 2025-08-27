-- Simple Youth Groups Database Setup
-- Run this in Supabase SQL Editor

-- 1. Create youth_groups table
CREATE TABLE IF NOT EXISTS youth_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    mission_statement TEXT,
    parish VARCHAR(255),
    diocese VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    meeting_location TEXT,
    meeting_time VARCHAR(255),
    meeting_frequency VARCHAR(100),
    age_range VARCHAR(100),
    max_members INTEGER DEFAULT 50,
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 3. Create group_events table
CREATE TABLE IF NOT EXISTS group_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    max_attendees INTEGER DEFAULT 50,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create group_posts table
CREATE TABLE IF NOT EXISTS group_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_owner ON youth_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_youth_groups_active ON youth_groups(is_active);
CREATE INDEX IF NOT EXISTS idx_youth_groups_public ON youth_groups(is_public);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members(status);
CREATE INDEX IF NOT EXISTS idx_group_events_group ON group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON group_posts(group_id);

-- 6. Insert a sample group for testing
INSERT INTO youth_groups (name, description, mission_statement, parish, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, is_public, owner_id)
VALUES (
    'Sample Youth Group',
    'A sample youth group for testing',
    'To bring Catholic youth together',
    'Sample Parish',
    'Sample City',
    'Sample State',
    'Sample Country',
    'Parish Hall',
    'Sunday',
    'weekly',
    '18-25',
    true,
    (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING;

-- 7. Add the creator as a member
INSERT INTO group_members (group_id, user_id, role, status)
SELECT 
    yg.id,
    yg.owner_id,
    'owner',
    'active'
FROM youth_groups yg
WHERE yg.name = 'Sample Youth Group'
ON CONFLICT DO NOTHING;

-- 8. Create a sample event
INSERT INTO group_events (group_id, title, description, event_date, location, is_public, created_by)
SELECT 
    yg.id,
    'Sample Event',
    'This is a sample event for testing',
    NOW() + INTERVAL '7 days',
    'Parish Hall',
    true,
    yg.owner_id
FROM youth_groups yg
WHERE yg.name = 'Sample Youth Group'
ON CONFLICT DO NOTHING;

-- 9. Create a sample post
INSERT INTO group_posts (group_id, title, content, post_type, is_public, user_id)
SELECT 
    yg.id,
    'Sample Post',
    'This is a sample post for testing the youth groups feature.',
    'general',
    true,
    yg.owner_id
FROM youth_groups yg
WHERE yg.name = 'Sample Youth Group'
ON CONFLICT DO NOTHING;

-- 10. Enable Row Level Security (RLS)
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- 11. Create basic RLS policies
-- Allow users to view public groups
CREATE POLICY "Users can view public groups" ON youth_groups
    FOR SELECT USING (is_public = true);

-- Allow users to view groups they're members of
CREATE POLICY "Users can view groups they're in" ON youth_groups
    FOR SELECT USING (
        id IN (
            SELECT group_id 
            FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Allow authenticated users to create groups
CREATE POLICY "Users can create groups" ON youth_groups
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow group owners to update their groups
CREATE POLICY "Owners can update groups" ON youth_groups
    FOR UPDATE USING (owner_id = auth.uid());

-- Allow group owners to delete their groups
CREATE POLICY "Owners can delete groups" ON youth_groups
    FOR DELETE USING (owner_id = auth.uid());

-- Allow users to view members of groups they're in
CREATE POLICY "Users can view members of their groups" ON group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id 
            FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Allow group owners to manage members
CREATE POLICY "Owners can manage members" ON group_members
    FOR ALL USING (
        group_id IN (
            SELECT id 
            FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Allow users to join public groups
CREATE POLICY "Users can join public groups" ON group_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM youth_groups 
            WHERE id = group_id AND is_public = true
        ) AND auth.uid() IS NOT NULL
    );

-- Allow users to view events of groups they're in
CREATE POLICY "Users can view group events" ON group_events
    FOR SELECT USING (
        group_id IN (
            SELECT group_id 
            FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Allow group members to create events
CREATE POLICY "Members can create events" ON group_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM group_members 
            WHERE group_id = group_events.group_id 
            AND user_id = auth.uid() 
            AND status = 'active'
        )
    );

-- Allow event creators and group owners to update events
CREATE POLICY "Creators and owners can update events" ON group_events
    FOR UPDATE USING (
        created_by = auth.uid() OR
        group_id IN (
            SELECT id 
            FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Allow event creators and group owners to delete events
CREATE POLICY "Creators and owners can delete events" ON group_events
    FOR DELETE USING (
        created_by = auth.uid() OR
        group_id IN (
            SELECT id 
            FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Allow users to view posts of groups they're in
CREATE POLICY "Users can view group posts" ON group_posts
    FOR SELECT USING (
        group_id IN (
            SELECT group_id 
            FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Allow group members to create posts
CREATE POLICY "Members can create posts" ON group_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM group_members 
            WHERE group_id = group_posts.group_id 
            AND user_id = auth.uid() 
            AND status = 'active'
        )
    );

-- Allow post creators and group owners to update posts
CREATE POLICY "Creators and owners can update posts" ON group_posts
    FOR UPDATE USING (
        user_id = auth.uid() OR
        group_id IN (
            SELECT id 
            FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Allow post creators and group owners to delete posts
CREATE POLICY "Creators and owners can delete posts" ON group_posts
    FOR DELETE USING (
        user_id = auth.uid() OR
        group_id IN (
            SELECT id 
            FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- 12. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Create triggers for updated_at
CREATE TRIGGER update_youth_groups_updated_at 
    BEFORE UPDATE ON youth_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_events_updated_at 
    BEFORE UPDATE ON group_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_posts_updated_at 
    BEFORE UPDATE ON group_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- Success message
SELECT 'Youth Groups database setup completed successfully!' as status;

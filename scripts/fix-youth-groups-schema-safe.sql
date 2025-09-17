-- Youth Groups Schema Fix Script (Safe Version)
-- This script safely fixes database schema inconsistencies and creates missing tables
-- It handles existing policies and tables gracefully

-- 1. First, let's check what tables exist and create missing ones
-- Create group_join_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_join_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    message TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    review_message TEXT,
    UNIQUE(group_id, user_id)
);

-- Create group_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    event_time VARCHAR(50),
    location TEXT,
    max_attendees INTEGER,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS group_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'general' CHECK (post_type IN ('general', 'announcement', 'prayer', 'event', 'discussion', 'prayer_request', 'event_reminder')),
    is_pinned BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Ensure group_members table has all required columns
ALTER TABLE group_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_youth_groups_owner_id ON youth_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_youth_groups_public ON youth_groups(is_public, is_active);
CREATE INDEX IF NOT EXISTS idx_youth_groups_location ON youth_groups(city, state, country);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON group_members(status);
CREATE INDEX IF NOT EXISTS idx_group_join_requests_group_id ON group_join_requests(group_id);
CREATE INDEX IF NOT EXISTS idx_group_join_requests_user_id ON group_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_group_join_requests_status ON group_join_requests(status);
CREATE INDEX IF NOT EXISTS idx_group_events_group_id ON group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_group_events_date ON group_events(event_date);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_user_id ON group_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_type ON group_posts(post_type);

-- 5. Enable Row Level Security on all tables
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies to avoid conflicts (using IF EXISTS)
DROP POLICY IF EXISTS "Users can view public groups" ON youth_groups;
DROP POLICY IF EXISTS "Users can view groups they're members of" ON youth_groups;
DROP POLICY IF EXISTS "Users can create groups" ON youth_groups;
DROP POLICY IF EXISTS "Owners can update their groups" ON youth_groups;
DROP POLICY IF EXISTS "Owners can delete their groups" ON youth_groups;
DROP POLICY IF EXISTS "Users can view members of groups they're in" ON group_members;
DROP POLICY IF EXISTS "Users can join public groups" ON group_members;
DROP POLICY IF EXISTS "Group owners can manage members" ON group_members;
DROP POLICY IF EXISTS "Users can create join requests" ON group_join_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON group_join_requests;
DROP POLICY IF EXISTS "Group owners can view group requests" ON group_join_requests;
DROP POLICY IF EXISTS "Group owners can manage requests" ON group_join_requests;
DROP POLICY IF EXISTS "Users can view events of groups they're in" ON group_events;
DROP POLICY IF EXISTS "Group members can create events" ON group_events;
DROP POLICY IF EXISTS "Event creators can update their events" ON group_events;
DROP POLICY IF EXISTS "Group owners can manage all events" ON group_events;
DROP POLICY IF EXISTS "Users can view posts of groups they're in" ON group_posts;
DROP POLICY IF EXISTS "Group members can create posts" ON group_posts;
DROP POLICY IF EXISTS "Post creators can update their posts" ON group_posts;
DROP POLICY IF EXISTS "Group owners can manage all posts" ON group_posts;

-- 7. Create comprehensive RLS policies

-- Youth Groups RLS Policies
CREATE POLICY "Users can view public groups" ON youth_groups
    FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Users can view groups they're members of" ON youth_groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Users can create groups" ON youth_groups
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their groups" ON youth_groups
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their groups" ON youth_groups
    FOR DELETE USING (owner_id = auth.uid());

-- Group Members RLS Policies
CREATE POLICY "Users can view members of groups they're in" ON group_members
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Users can join public groups" ON group_members
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM youth_groups 
            WHERE id = group_id AND is_public = true
        ) AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Group owners can manage members" ON group_members
    FOR ALL USING (
        group_id IN (
            SELECT id FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Group Join Requests RLS Policies
CREATE POLICY "Users can create join requests" ON group_join_requests
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own requests" ON group_join_requests
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Group owners can view group requests" ON group_join_requests
    FOR SELECT USING (
        group_id IN (
            SELECT id FROM youth_groups WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Group owners can manage requests" ON group_join_requests
    FOR UPDATE USING (
        group_id IN (
            SELECT id FROM youth_groups WHERE owner_id = auth.uid()
        )
    );

-- Group Events RLS Policies
CREATE POLICY "Users can view events of groups they're in" ON group_events
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Group members can create events" ON group_events
    FOR INSERT WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Event creators can update their events" ON group_events
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Group owners can manage all events" ON group_events
    FOR ALL USING (
        group_id IN (
            SELECT id FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- Group Posts RLS Policies
CREATE POLICY "Users can view posts of groups they're in" ON group_posts
    FOR SELECT USING (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Group members can create posts" ON group_posts
    FOR INSERT WITH CHECK (
        group_id IN (
            SELECT group_id FROM group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Post creators can update their posts" ON group_posts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Group owners can manage all posts" ON group_posts
    FOR ALL USING (
        group_id IN (
            SELECT id FROM youth_groups 
            WHERE owner_id = auth.uid()
        )
    );

-- 8. Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_youth_groups_updated_at ON youth_groups;
DROP TRIGGER IF EXISTS update_group_events_updated_at ON group_events;
DROP TRIGGER IF EXISTS update_group_posts_updated_at ON group_posts;

CREATE TRIGGER update_youth_groups_updated_at 
    BEFORE UPDATE ON youth_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_events_updated_at 
    BEFORE UPDATE ON group_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_posts_updated_at 
    BEFORE UPDATE ON group_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Create function to update member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE youth_groups 
        SET member_count = member_count + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE youth_groups 
        SET member_count = member_count - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status != NEW.status THEN
            IF NEW.status = 'active' AND OLD.status != 'active' THEN
                UPDATE youth_groups 
                SET member_count = member_count + 1 
                WHERE id = NEW.group_id;
            ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
                UPDATE youth_groups 
                SET member_count = member_count - 1 
                WHERE id = NEW.group_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for member count updates
DROP TRIGGER IF EXISTS trigger_update_group_member_count ON group_members;
CREATE TRIGGER trigger_update_group_member_count
    AFTER INSERT OR UPDATE OR DELETE ON group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- 10. Update existing data to set default values
UPDATE youth_groups 
SET requires_approval = true 
WHERE requires_approval IS NULL;

UPDATE youth_groups 
SET member_count = (
    SELECT COUNT(*) 
    FROM group_members 
    WHERE group_id = youth_groups.id AND status = 'active'
)
WHERE member_count IS NULL OR member_count = 0;

-- 11. Grant necessary permissions
GRANT ALL ON youth_groups TO authenticated;
GRANT ALL ON group_members TO authenticated;
GRANT ALL ON group_join_requests TO authenticated;
GRANT ALL ON group_events TO authenticated;
GRANT ALL ON group_posts TO authenticated;

-- Success message
SELECT 'Youth Groups schema fixed successfully! All tables created and policies applied.' as message;

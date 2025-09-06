-- Add Basic RLS Policies for Launch
-- Run this in Supabase SQL Editor

-- Enable RLS on critical tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Prayer requests policies
CREATE POLICY "Anyone can view public prayer requests" ON prayer_requests
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own prayer requests" ON prayer_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer requests" ON prayer_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests" ON prayer_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view their own journal entries" ON journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" ON journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Youth groups policies
CREATE POLICY "Anyone can view public youth groups" ON youth_groups
    FOR SELECT USING (is_public = true);

CREATE POLICY "Group owners can view their groups" ON youth_groups
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can update their groups" ON youth_groups
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups" ON youth_groups
    FOR DELETE USING (auth.uid() = owner_id);

-- Group members policies
CREATE POLICY "Group members can view group members" ON group_members
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM youth_groups 
            WHERE youth_groups.id = group_members.group_id 
            AND youth_groups.owner_id = auth.uid()
        )
    );

CREATE POLICY "Group owners can manage members" ON group_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM youth_groups 
            WHERE youth_groups.id = group_members.group_id 
            AND youth_groups.owner_id = auth.uid()
        )
    );

-- Group events policies
CREATE POLICY "Anyone can view public group events" ON group_events
    FOR SELECT USING (true);

CREATE POLICY "Group owners can manage events" ON group_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM youth_groups 
            WHERE youth_groups.id = group_events.group_id 
            AND youth_groups.owner_id = auth.uid()
        )
    );

-- Group posts policies
CREATE POLICY "Anyone can view public group posts" ON group_posts
    FOR SELECT USING (true);

CREATE POLICY "Group owners can manage posts" ON group_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM youth_groups 
            WHERE youth_groups.id = group_posts.group_id 
            AND youth_groups.owner_id = auth.uid()
        )
    );

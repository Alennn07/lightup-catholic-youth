-- Drop existing tables if they exist
DROP TABLE IF EXISTS group_posts CASCADE;
DROP TABLE IF EXISTS group_events CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS youth_groups CASCADE;

-- Create youth_groups table
CREATE TABLE youth_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    mission_statement TEXT,
    parish VARCHAR(255),
    diocese VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(100),
    country VARCHAR(100),
    meeting_location TEXT,
    meeting_time VARCHAR(255),
    meeting_frequency VARCHAR(100),
    age_range VARCHAR(100),
    max_members INTEGER DEFAULT 50,
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    UNIQUE(group_id, user_id)
);

-- Create group_events table
CREATE TABLE group_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    max_attendees INTEGER,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_posts table
CREATE TABLE group_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'general' CHECK (post_type IN ('general', 'announcement', 'prayer', 'event')),
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_youth_groups_owner ON youth_groups(owner_id);
CREATE INDEX idx_youth_groups_location ON youth_groups(city, state, country);
CREATE INDEX idx_youth_groups_public ON youth_groups(is_public, is_active);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_events_group ON group_events(group_id);
CREATE INDEX idx_group_events_date ON group_events(event_date);
CREATE INDEX idx_group_posts_group ON group_posts(group_id);
CREATE INDEX idx_group_posts_user ON group_posts(user_id);
CREATE INDEX idx_group_posts_type ON group_posts(post_type);

-- Enable Row Level Security
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for youth_groups
CREATE POLICY "Users can view public groups" ON youth_groups
    FOR SELECT USING (is_public = true);

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

-- RLS Policies for group_members
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

-- RLS Policies for group_events
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

-- RLS Policies for group_posts
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

-- Insert sample data
INSERT INTO youth_groups (name, description, mission_statement, parish, diocese, city, state, country, meeting_location, meeting_time, meeting_frequency, age_range, max_members, owner_id) VALUES
('St. Mary''s Youth Ministry', 'A vibrant community for young Catholics to grow in faith together', 'To inspire and empower young people to live their Catholic faith with joy and purpose', 'St. Mary''s Catholic Church', 'Diocese of New York', 'New York', 'NY', 'USA', 'St. Mary''s Parish Hall', 'Every Sunday 6:00 PM', 'Weekly', '13-18', 30, (SELECT id FROM users LIMIT 1)),
('Young Adults Bible Study', 'Deep dive into Scripture for young adults seeking spiritual growth', 'To deepen understanding of God''s Word and apply it to daily life', 'Sacred Heart Parish', 'Diocese of Los Angeles', 'Los Angeles', 'CA', 'USA', 'Sacred Heart Community Center', 'Every Tuesday 7:30 PM', 'Weekly', '18-35', 25, (SELECT id FROM users LIMIT 1)),
('Catholic Teens Connect', 'Building friendships and faith among Catholic teenagers', 'To create a supportive community where teens can grow together in Christ', 'Our Lady of Grace', 'Diocese of Chicago', 'Chicago', 'IL', 'USA', 'OLG Youth Room', 'Every Friday 4:00 PM', 'Weekly', '13-19', 40, (SELECT id FROM users LIMIT 1)),
('Faith & Fellowship', 'A welcoming group for young Catholics to share their journey', 'To foster authentic relationships centered on Christ and Catholic values', 'St. Joseph''s Church', 'Diocese of Miami', 'Miami', 'FL', 'USA', 'St. Joseph''s Hall', 'Every Saturday 5:00 PM', 'Weekly', '16-25', 35, (SELECT id FROM users LIMIT 1)),
('Youth Prayer Warriors', 'Dedicated to prayer and spiritual warfare for young people', 'To equip youth with prayer tools and build a prayerful community', 'Holy Trinity Parish', 'Diocese of Boston', 'Boston', 'MA', 'USA', 'Holy Trinity Chapel', 'Every Wednesday 6:00 PM', 'Weekly', '14-22', 20, (SELECT id FROM users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample group members (assuming the first user from users table)
INSERT INTO group_members (group_id, user_id, role, status) VALUES
((SELECT id FROM youth_groups WHERE name = 'St. Mary''s Youth Ministry' LIMIT 1), (SELECT id FROM users LIMIT 1), 'owner', 'active'),
((SELECT id FROM youth_groups WHERE name = 'Young Adults Bible Study' LIMIT 1), (SELECT id FROM users LIMIT 1), 'owner', 'active'),
((SELECT id FROM youth_groups WHERE name = 'Catholic Teens Connect' LIMIT 1), (SELECT id FROM users LIMIT 1), 'owner', 'active'),
((SELECT id FROM youth_groups WHERE name = 'Faith & Fellowship' LIMIT 1), (SELECT id FROM users LIMIT 1), 'owner', 'active'),
((SELECT id FROM youth_groups WHERE name = 'Youth Prayer Warriors' LIMIT 1), (SELECT id FROM users LIMIT 1), 'owner', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample group events
INSERT INTO group_events (group_id, title, description, event_date, location, max_attendees, created_by) VALUES
((SELECT id FROM youth_groups WHERE name = 'St. Mary''s Youth Ministry' LIMIT 1), 'Summer Retreat 2024', 'Join us for a weekend of faith, fun, and fellowship!', NOW() + INTERVAL '30 days', 'Camp St. Francis', 30, (SELECT id FROM users LIMIT 1)),
((SELECT id FROM youth_groups WHERE name = 'Young Adults Bible Study' LIMIT 1), 'Gospel of John Study', 'Deep dive into the Gospel of John - Chapter 1', NOW() + INTERVAL '7 days', 'Sacred Heart Community Center', 25, (SELECT id FROM users LIMIT 1)),
((SELECT id FROM youth_groups WHERE name = 'Catholic Teens Connect' LIMIT 1), 'Movie Night & Discussion', 'Watch "The Chosen" and discuss faith themes', NOW() + INTERVAL '14 days', 'OLG Youth Room', 40, (SELECT id FROM users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert sample group posts
INSERT INTO group_posts (group_id, user_id, title, content, post_type) VALUES
((SELECT id FROM youth_groups WHERE name = 'St. Mary''s Youth Ministry' LIMIT 1), (SELECT id FROM users LIMIT 1), 'Welcome to Our Group!', 'We''re excited to have you all here! Let''s grow together in faith!', 'announcement'),
((SELECT id FROM youth_groups WHERE name = 'Young Adults Bible Study' LIMIT 1), (SELECT id FROM users LIMIT 1), 'Prayer Request', 'Please pray for my family during this difficult time', 'prayer'),
((SELECT id FROM youth_groups WHERE name = 'Catholic Teens Connect' LIMIT 1), (SELECT id FROM users LIMIT 1), 'Upcoming Event', 'Don''t forget about our movie night next week!', 'event')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_youth_groups_updated_at BEFORE UPDATE ON youth_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_events_updated_at BEFORE UPDATE ON group_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_posts_updated_at BEFORE UPDATE ON group_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

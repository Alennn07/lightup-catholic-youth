-- Group Categories Enhancement Script
-- Adds proper categorization system for Youth Groups

-- 1. Create group_categories table
CREATE TABLE IF NOT EXISTS group_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add category_id to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES group_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS group_image_url TEXT,
ADD COLUMN IF NOT EXISTS group_image_alt TEXT,
ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_invitation_only BOOLEAN DEFAULT false;

-- 3. Create group_invitations table
CREATE TABLE IF NOT EXISTS group_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    invitation_code VARCHAR(20) UNIQUE NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invited_email VARCHAR(255),
    invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create group_analytics table for detailed metrics
CREATE TABLE IF NOT EXISTS group_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'views', 'joins', 'events_created', 'posts_created', 'activity_score'
    metric_value INTEGER DEFAULT 0,
    metric_date DATE NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, metric_type, metric_date)
);

-- 5. Insert default categories
INSERT INTO group_categories (name, description, icon, color, sort_order) VALUES
('Prayer & Worship', 'Groups focused on prayer, adoration, and worship', 'prayer', '#8B5CF6', 1),
('Bible Study', 'Groups for studying Scripture and faith formation', 'book-open', '#10B981', 2),
('Service & Outreach', 'Groups focused on community service and outreach', 'heart', '#EF4444', 3),
('Social & Fellowship', 'Groups for building community and friendships', 'users', '#F59E0B', 4),
('Music & Arts', 'Groups focused on music, art, and creative expression', 'music', '#EC4899', 5),
('Sports & Recreation', 'Groups for physical activities and sports', 'activity', '#06B6D4', 6),
('Education & Learning', 'Groups focused on academic and educational pursuits', 'graduation-cap', '#84CC16', 7),
('Young Adults', 'Groups specifically for young adults (18-35)', 'user-check', '#6366F1', 8),
('Teens', 'Groups specifically for teenagers (13-17)', 'smile', '#F97316', 9),
('Family', 'Groups for families and parents', 'home', '#14B8A6', 10)
ON CONFLICT (name) DO NOTHING;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_category ON youth_groups(category_id);
CREATE INDEX IF NOT EXISTS idx_youth_groups_invitation_code ON youth_groups(invitation_code);
CREATE INDEX IF NOT EXISTS idx_group_invitations_code ON group_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_group_invitations_group ON group_invitations(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_email ON group_invitations(invited_email);
CREATE INDEX IF NOT EXISTS idx_group_analytics_group_date ON group_analytics(group_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_group_analytics_type ON group_analytics(metric_type);

-- 7. Enable RLS
ALTER TABLE group_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_analytics ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Categories are public read-only
CREATE POLICY "Categories are publicly readable" ON group_categories FOR SELECT USING (is_active = true);

-- Invitations policies
CREATE POLICY "Users can view their own invitations" ON group_invitations FOR SELECT USING (
    invited_user_id = auth.uid() OR 
    invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Group owners can manage invitations" ON group_invitations FOR ALL USING (
    group_id IN (SELECT id FROM youth_groups WHERE owner_id = auth.uid())
);

-- Analytics policies
CREATE POLICY "Group members can view group analytics" ON group_analytics FOR SELECT USING (
    group_id IN (
        SELECT gm.group_id FROM group_members gm 
        WHERE gm.user_id = auth.uid() AND gm.status = 'active'
    )
);

-- 9. Create function to generate invitation codes
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM group_invitations WHERE invitation_code = code) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- 10. Create function to update group analytics
CREATE OR REPLACE FUNCTION update_group_analytics(
    p_group_id UUID,
    p_metric_type VARCHAR(50),
    p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO group_analytics (group_id, metric_type, metric_value, metric_date)
    VALUES (p_group_id, p_metric_type, p_increment, CURRENT_DATE)
    ON CONFLICT (group_id, metric_type, metric_date)
    DO UPDATE SET 
        metric_value = group_analytics.metric_value + p_increment,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 11. Create trigger to auto-generate invitation codes
CREATE OR REPLACE FUNCTION auto_generate_invitation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invitation_code IS NULL THEN
        NEW.invitation_code := generate_invitation_code();
        NEW.invitation_expires_at := NOW() + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_invitation_code
    BEFORE INSERT ON youth_groups
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_invitation_code();

-- Success message
SELECT 'Group categories, invitations, and analytics system created successfully!' as status;

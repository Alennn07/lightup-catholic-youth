-- Youth Groups Role-Based Enhancement (Fixed Version)
-- This script enhances the existing database schema for role-based access control
-- Handles existing policies and objects gracefully

-- 1. Add role-based columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_role VARCHAR(50) DEFAULT 'member',
ADD COLUMN IF NOT EXISTS can_create_groups BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_group_leader BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Enhance youth_groups table with ownership and approval settings
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS requires_approval BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- 3. Create group_join_requests table for approval workflow
CREATE TABLE IF NOT EXISTS group_join_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    message TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    review_message TEXT,
    UNIQUE(group_id, user_id)
);

-- 4. Enhance youth_group_members table with status and permissions
ALTER TABLE youth_group_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS can_manage_members BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_create_events BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS can_create_posts BOOLEAN DEFAULT false;

-- 5. Create group_notifications table for real-time updates
CREATE TABLE IF NOT EXISTS group_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_owner_id ON youth_groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_youth_groups_public ON youth_groups(is_public, is_active);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON youth_group_members(group_id, role);
CREATE INDEX IF NOT EXISTS idx_group_members_status ON youth_group_members(group_id, status);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON group_join_requests(group_id, status);
CREATE INDEX IF NOT EXISTS idx_join_requests_user ON group_join_requests(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON group_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_group ON group_notifications(group_id, created_at);

-- 7. Update existing data to set default values
UPDATE users 
SET user_role = 'member', 
    can_create_groups = false, 
    is_group_leader = false 
WHERE user_role IS NULL;

-- Set group creators as leaders and allow them to create groups
UPDATE users 
SET user_role = 'group_leader', 
    can_create_groups = true, 
    is_group_leader = true 
WHERE id IN (
    SELECT DISTINCT created_by 
    FROM youth_groups 
    WHERE created_by IS NOT NULL
);

-- Set group owners
UPDATE youth_groups 
SET owner_id = created_by 
WHERE created_by IS NOT NULL AND owner_id IS NULL;

-- 8. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public groups" ON youth_groups;
DROP POLICY IF EXISTS "Group owners can view their groups" ON youth_groups;
DROP POLICY IF EXISTS "Group members can view their groups" ON youth_groups;
DROP POLICY IF EXISTS "Group leaders can create groups" ON youth_groups;
DROP POLICY IF EXISTS "Group owners can update their groups" ON youth_groups;
DROP POLICY IF EXISTS "Group owners can delete their groups" ON youth_groups;

DROP POLICY IF EXISTS "Users can view group members" ON youth_group_members;
DROP POLICY IF EXISTS "Group owners can manage members" ON youth_group_members;
DROP POLICY IF EXISTS "Users can join groups" ON youth_group_members;

DROP POLICY IF EXISTS "Users can create join requests" ON group_join_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON group_join_requests;
DROP POLICY IF EXISTS "Group owners can view group requests" ON group_join_requests;
DROP POLICY IF EXISTS "Group owners can manage requests" ON group_join_requests;

DROP POLICY IF EXISTS "Users can view their notifications" ON group_notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON group_notifications;

-- 9. Enable RLS on all tables
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_notifications ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for role-based access control

-- Youth Groups RLS Policies
CREATE POLICY "Users can view public groups" ON youth_groups
    FOR SELECT USING (is_public = true AND is_active = true);

CREATE POLICY "Group owners can view their groups" ON youth_groups
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Group members can view their groups" ON youth_groups
    FOR SELECT USING (
        id IN (
            SELECT group_id FROM youth_group_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Group leaders can create groups" ON youth_groups
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM users 
            WHERE can_create_groups = true
        )
    );

CREATE POLICY "Group owners can update their groups" ON youth_groups
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Group owners can delete their groups" ON youth_groups
    FOR DELETE USING (auth.uid() = owner_id);

-- Youth Group Members RLS Policies
CREATE POLICY "Users can view group members" ON youth_group_members
    FOR SELECT USING (
        group_id IN (
            SELECT id FROM youth_groups 
            WHERE is_public = true OR owner_id = auth.uid() OR id IN (
                SELECT group_id FROM youth_group_members 
                WHERE user_id = auth.uid() AND status = 'active'
            )
        )
    );

CREATE POLICY "Group owners can manage members" ON youth_group_members
    FOR ALL USING (
        group_id IN (
            SELECT id FROM youth_groups WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can join groups" ON youth_group_members
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        group_id IN (
            SELECT id FROM youth_groups 
            WHERE is_public = true AND is_active = true
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

-- Group Notifications RLS Policies
CREATE POLICY "Users can view their notifications" ON group_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON group_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- 11. Create functions for common operations

-- Function to check if user can create groups
CREATE OR REPLACE FUNCTION can_user_create_groups(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id AND can_create_groups = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is group owner
CREATE OR REPLACE FUNCTION is_group_owner(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM youth_groups 
        WHERE id = group_id AND owner_id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is group member
CREATE OR REPLACE FUNCTION is_group_member(group_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM youth_group_members 
        WHERE group_id = group_id AND user_id = user_id AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role in group
CREATE OR REPLACE FUNCTION get_user_group_role(group_id UUID, user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role INTO user_role
    FROM youth_group_members 
    WHERE group_id = group_id AND user_id = user_id AND status = 'active';
    
    RETURN COALESCE(user_role, 'non_member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create triggers for automatic updates

-- Trigger to update member count when members are added/removed
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_group_member_count ON youth_group_members;

-- Create the trigger
CREATE TRIGGER trigger_update_group_member_count
    AFTER INSERT OR UPDATE OR DELETE ON youth_group_members
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Trigger to create notifications for join requests
CREATE OR REPLACE FUNCTION create_join_request_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
        INSERT INTO group_notifications (group_id, user_id, type, title, message)
        SELECT 
            NEW.group_id,
            yg.owner_id,
            'join_request',
            'New Join Request',
            'A new member has requested to join ' || yg.name || '.'
        FROM youth_groups yg
        WHERE yg.id = NEW.group_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_create_join_request_notification ON group_join_requests;

-- Create the trigger
CREATE TRIGGER trigger_create_join_request_notification
    AFTER INSERT ON group_join_requests
    FOR EACH ROW EXECUTE FUNCTION create_join_request_notification();

-- 13. Create view for group statistics
CREATE OR REPLACE VIEW group_statistics AS
SELECT 
    yg.id,
    yg.name,
    yg.owner_id,
    yg.member_count,
    yg.max_members,
    COUNT(gjr.id) as pending_requests,
    COUNT(CASE WHEN gjr.status = 'approved' THEN 1 END) as approved_requests,
    COUNT(CASE WHEN gjr.status = 'rejected' THEN 1 END) as rejected_requests
FROM youth_groups yg
LEFT JOIN group_join_requests gjr ON yg.id = gjr.group_id
GROUP BY yg.id, yg.name, yg.owner_id, yg.member_count, yg.max_members;

-- 14. Grant necessary permissions
GRANT SELECT ON group_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_create_groups(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_group_owner(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_group_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_group_role(UUID, UUID) TO authenticated;

-- Success message
SELECT 'Youth Groups Role-Based Enhancement completed successfully!' as message;
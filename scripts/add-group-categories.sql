-- Add Group Categories System to Youth Groups
-- This script adds proper categorization support for youth groups

-- Create group_categories table
CREATE TABLE IF NOT EXISTS group_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
    icon VARCHAR(50), -- Icon name for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES group_categories(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_category_id ON youth_groups(category_id);
CREATE INDEX IF NOT EXISTS idx_group_categories_active ON group_categories(is_active);

-- Insert default categories
INSERT INTO group_categories (name, description, color, icon, sort_order) VALUES
('Bible Study', 'Groups focused on studying and discussing the Bible', '#10B981', 'book-open', 1),
('Prayer Group', 'Groups dedicated to prayer and spiritual growth', '#8B5CF6', 'heart', 2),
('Service & Outreach', 'Groups focused on community service and helping others', '#F59E0B', 'hands-helping', 3),
('Youth Ministry', 'General youth ministry and fellowship groups', '#3B82F6', 'users', 4),
('Music & Worship', 'Groups focused on music, worship, and liturgical arts', '#EF4444', 'music', 5),
('Sports & Recreation', 'Groups combining faith with physical activities', '#06B6D4', 'activity', 6),
('Social Justice', 'Groups focused on social justice and advocacy', '#84CC16', 'scale', 7),
('Leadership Development', 'Groups focused on developing leadership skills', '#F97316', 'award', 8),
('Campus Ministry', 'Groups for students and campus-based ministry', '#8B5CF6', 'graduation-cap', 9),
('Family Ministry', 'Groups for families and intergenerational ministry', '#EC4899', 'home', 10)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE group_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for group_categories
-- Everyone can read active categories
CREATE POLICY "Anyone can view active categories" ON group_categories
    FOR SELECT USING (is_active = true);

-- Only authenticated users can view all categories (for admin purposes)
CREATE POLICY "Authenticated users can view all categories" ON group_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can insert/update/delete categories
CREATE POLICY "Only admins can manage categories" ON group_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.is_verified = true
        )
    );

-- Update the youth_groups table to include category information in queries
-- This will be handled by the API layer, but we ensure the foreign key is properly set up

-- Add a comment to document the new feature
COMMENT ON TABLE group_categories IS 'Categories for organizing youth groups by type and focus area';
COMMENT ON COLUMN youth_groups.category_id IS 'References group_categories.id - categorizes the group type';
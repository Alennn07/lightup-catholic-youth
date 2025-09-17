-- Add Analytics Tables for Youth Groups (Fixed Version)
-- This script adds the necessary tables for analytics and activity tracking

-- First, drop the user_activities table if it exists to start fresh
DROP TABLE IF EXISTS user_activities CASCADE;

-- Create user_activities table for tracking user actions
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    group_id UUID REFERENCES youth_groups(id) ON DELETE CASCADE,
    event_id UUID REFERENCES group_events(id) ON DELETE CASCADE,
    post_id UUID REFERENCES group_posts(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    activity_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add analytics columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS groups_joined INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS groups_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS events_attended INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_created INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add analytics columns to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS events_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_timestamp ON user_activities(activity_timestamp);
CREATE INDEX idx_user_activities_group_id ON user_activities(group_id);

-- Enable RLS on user_activities
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities" ON user_activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own activities" ON user_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON user_activities TO authenticated;

-- Success message
SELECT 'Analytics tables created successfully!' as message;

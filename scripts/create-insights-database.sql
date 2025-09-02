-- Create user insights and activity tracking tables
-- This script creates tables for personalized faith insights and user activity tracking

-- User Activity Tracking Table
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'prayer', 'bible_reading', 'journal', 'community'
    activity_data JSONB, -- Store additional activity-specific data
    duration_minutes INTEGER, -- For timed activities like prayer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Insights Table
CREATE TABLE IF NOT EXISTS user_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- 'daily_focus', 'weekly_challenge', 'recommendation'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_text VARCHAR(100), -- Button text like "Start Prayer"
    action_url VARCHAR(255), -- Where the action should redirect
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE, -- When this insight expires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer Sessions Table
CREATE TABLE IF NOT EXISTS prayer_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) DEFAULT 'guided', -- 'guided', 'freeform', 'meditation'
    duration_minutes INTEGER NOT NULL,
    prayer_focus TEXT, -- What the user prayed about
    mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 5), -- 1-5 scale
    mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 5), -- 1-5 scale
    notes TEXT, -- Optional prayer notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Challenges Table
CREATE TABLE IF NOT EXISTS weekly_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_type VARCHAR(50) NOT NULL, -- 'prayer_request', 'bible_reading', 'community_engagement'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_count INTEGER DEFAULT 1, -- How many times to complete
    current_count INTEGER DEFAULT 0, -- Current progress
    week_start DATE NOT NULL, -- Start of the week
    week_end DATE NOT NULL, -- End of the week
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);

CREATE INDEX IF NOT EXISTS idx_user_insights_user_id ON user_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_insights_type ON user_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_user_insights_active ON user_insights(is_active);

CREATE INDEX IF NOT EXISTS idx_prayer_sessions_user_id ON prayer_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_sessions_created_at ON prayer_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_weekly_challenges_user_id ON weekly_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_week ON weekly_challenges(week_start, week_end);

-- Enable Row Level Security (RLS)
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User Activity Policies
CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id);

-- User Insights Policies
CREATE POLICY "Users can view their own insights" ON user_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights" ON user_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON user_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Prayer Sessions Policies
CREATE POLICY "Users can view their own prayer sessions" ON prayer_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer sessions" ON prayer_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer sessions" ON prayer_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly Challenges Policies
CREATE POLICY "Users can view their own challenges" ON weekly_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" ON weekly_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON weekly_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic insights generation
CREATE OR REPLACE FUNCTION generate_daily_insights(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    user_activity_count INTEGER;
    last_prayer_date TIMESTAMP;
    last_bible_date TIMESTAMP;
    insight_title VARCHAR(255);
    insight_description TEXT;
    action_text VARCHAR(100);
BEGIN
    -- Get user's recent activity
    SELECT COUNT(*) INTO user_activity_count
    FROM user_activity
    WHERE user_id = user_uuid
    AND created_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Get last prayer session
    SELECT MAX(created_at) INTO last_prayer_date
    FROM prayer_sessions
    WHERE user_id = user_uuid;
    
    -- Get last bible reading
    SELECT MAX(created_at) INTO last_bible_date
    FROM user_activity
    WHERE user_id = user_uuid
    AND activity_type = 'bible_reading';
    
    -- Generate daily focus insight
    IF last_prayer_date IS NULL OR last_prayer_date < CURRENT_DATE THEN
        insight_title := 'Daily Prayer Focus';
        insight_description := 'Take a moment to connect with God through prayer. Even 5-10 minutes can bring peace and clarity to your day.';
        action_text := 'Start Prayer';
    ELSIF last_bible_date IS NULL OR last_bible_date < CURRENT_DATE THEN
        insight_title := 'Scripture Reflection';
        insight_description := 'Spend time with God''s word today. Reading even one verse can provide guidance and comfort.';
        action_text := 'Read Scripture';
    ELSE
        insight_title := 'Gratitude Practice';
        insight_description := 'Reflect on the blessings in your life today. Gratitude opens our hearts to God''s love.';
        action_text := 'Practice Gratitude';
    END IF;
    
    -- Insert or update daily insight (only if no active insight exists for today)
    INSERT INTO user_insights (user_id, insight_type, title, description, action_text, action_url, expires_at)
    SELECT user_uuid, 'daily_focus', insight_title, insight_description, action_text, '/prayer-wall', CURRENT_DATE + INTERVAL '1 day'
    WHERE NOT EXISTS (
        SELECT 1 FROM user_insights 
        WHERE user_id = user_uuid 
        AND insight_type = 'daily_focus' 
        AND created_at::date = CURRENT_DATE
        AND is_active = true
    );
    
    -- Generate weekly challenge if it's Monday or no active challenge exists
    IF EXTRACT(DOW FROM CURRENT_DATE) = 1 OR NOT EXISTS (
        SELECT 1 FROM weekly_challenges 
        WHERE user_id = user_uuid 
        AND week_start <= CURRENT_DATE 
        AND week_end >= CURRENT_DATE
    ) THEN
        INSERT INTO weekly_challenges (user_id, challenge_type, title, description, target_count, week_start, week_end)
        VALUES (
            user_uuid, 
            'prayer_request', 
            'Share a Prayer Request', 
            'Connect with your community by sharing one prayer request this week. Your faith family is here to support you.',
            1,
            DATE_TRUNC('week', CURRENT_DATE),
            DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'
        )
        ON CONFLICT (user_id, week_start) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user insights
CREATE OR REPLACE FUNCTION get_user_insights(user_uuid UUID)
RETURNS TABLE (
    insight_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    action_text VARCHAR(100),
    action_url VARCHAR(255)
) AS $$
BEGIN
    -- Generate fresh insights first
    PERFORM generate_daily_insights(user_uuid);
    
    -- Return active insights
    RETURN QUERY
    SELECT 
        ui.insight_type,
        ui.title,
        ui.description,
        ui.action_text,
        ui.action_url
    FROM user_insights ui
    WHERE ui.user_id = user_uuid
    AND ui.is_active = true
    AND (ui.expires_at IS NULL OR ui.expires_at > NOW())
    ORDER BY ui.created_at DESC
    LIMIT 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

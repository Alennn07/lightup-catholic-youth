-- Script 3: Setup Security and Permissions
-- Run this THIRD after Script 2 succeeds

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_user_id ON user_verse_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_verse_date ON user_verse_progress(verse_date);
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user_id ON favorite_verses(user_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_theme ON bible_verses(theme);
CREATE INDEX IF NOT EXISTS idx_daily_verse_assignments_date ON daily_verse_assignments(assigned_date);

-- Enable Row Level Security
ALTER TABLE user_verse_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_verse_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own verse progress" ON user_verse_progress
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own verse progress" ON user_verse_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own verse progress" ON user_verse_progress
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own favorite verses" ON favorite_verses
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own favorite verses" ON favorite_verses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own favorite verses" ON favorite_verses
    FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Bible verses are public" ON bible_verses
    FOR SELECT USING (true);

CREATE POLICY "Daily verse assignments are public" ON daily_verse_assignments
    FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
SELECT 'Security and permissions setup completed successfully!' as status;

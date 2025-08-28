-- Simple Daily Bible Verse Database Setup
-- This script creates the essential tables without complex constraints

-- 1. Bible Verses Table - Store verse content
CREATE TABLE IF NOT EXISTS bible_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT UNIQUE NOT NULL,
    verse_text TEXT NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    theme TEXT,
    reflection TEXT,
    action_prompt TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Verse Assignments Table
CREATE TABLE IF NOT EXISTS daily_verse_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT NOT NULL,
    assigned_date DATE UNIQUE NOT NULL,
    theme TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User Verse Progress Table
CREATE TABLE IF NOT EXISTS user_verse_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    verse_id TEXT NOT NULL,
    verse_date DATE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Favorite Verses Table
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    verse_id TEXT NOT NULL,
    verse_text TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample Bible verses
INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'John', 3, 16, 'Love', 'God''s love is unconditional and eternal. He gave everything for us. How can you show this kind of love to others today?', 'Tell someone you love them today'),
('Proverbs 17:17', 'A friend loves at all times, and a brother is born for a time of adversity.', 'Proverbs', 17, 17, 'Friendship', 'True friends stick with you through the good times and the bad. They''re the ones who celebrate your victories and pick you up when you fall.', 'Reach out to a friend who might be going through a hard time'),
('Philippians 4:13', 'I can do all this through him who gives me strength.', 'Philippians', 4, 13, 'Strength', 'With God''s help, you can overcome any challenge. His strength is available to you every day.', 'Face a difficult situation with confidence today'),
('Psalm 119:105', 'Your word is a lamp for my feet, a light on my path.', 'Psalms', 119, 105, 'Guidance', 'God''s Word guides us like a flashlight in the dark. It shows us the right way to go.', 'Read a Bible verse and think about how it guides you'),
('Matthew 28:19', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.', 'Matthew', 28, 19, 'Mission', 'Jesus calls us to share His love with others. You don''t need to travel far to make a difference.', 'Share your faith with one person today');

-- Insert today's verse assignment
INSERT INTO daily_verse_assignments (verse_id, assigned_date, theme) VALUES
('Proverbs 17:17', CURRENT_DATE, 'Friendship')
ON CONFLICT (assigned_date) DO NOTHING;

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

-- Simple RLS Policies
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

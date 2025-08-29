-- Complete Daily Bible Verse Database Setup
-- This script will fix all the issues with the Daily Bible Verse feature

-- Step 1: Create the user_verse_progress table
CREATE TABLE IF NOT EXISTS user_verse_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id TEXT NOT NULL,
    verse_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, verse_date)
);

-- Step 2: Create the favorite_verses table
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, verse_id)
);

-- Step 3: Insert sample Bible verses for different dates
INSERT INTO bible_verses (verse, reference, reflection, theme, date) VALUES
('A friend loves at all times, and a brother is born for a time of adversity.', 'Proverbs 17:17', 'True friends stick with you through the good times and the bad. They''re the ones who celebrate your victories and pick you up when you fall.', 'Friendship', CURRENT_DATE),
('For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', 'Jeremiah 29:11', 'God has amazing plans for your life! Even when things seem uncertain, trust that He is working everything for your good.', 'Hope & Future', CURRENT_DATE + INTERVAL '1 day'),
('I can do all things through Christ who strengthens me.', 'Philippians 4:13', 'With Jesus, you have unlimited potential! He gives you the strength to overcome any challenge and achieve your dreams.', 'Strength & Power', CURRENT_DATE + INTERVAL '2 days'),
('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'Joshua 1:9', 'God is always with you! No matter where life takes you, you never have to face challenges alone.', 'Courage & Presence', CURRENT_DATE + INTERVAL '3 days'),
('Trust in the Lord with all your heart and lean not on your own understanding.', 'Proverbs 3:5', 'Sometimes God''s ways don''t make sense to us, but we can trust that He knows what''s best for our lives.', 'Trust & Wisdom', CURRENT_DATE + INTERVAL '4 days'),
('The Lord is my shepherd, I shall not want.', 'Psalm 23:1', 'Jesus is your perfect shepherd who provides everything you need. He guides, protects, and cares for you always.', 'Provision & Care', CURRENT_DATE + INTERVAL '5 days'),
('Love is patient, love is kind. It does not envy, it does not boast, it is not proud.', '1 Corinthians 13:4', 'True love is about putting others first and showing kindness in everything we do.', 'Love & Kindness', CURRENT_DATE + INTERVAL '6 days'),
('In all things God works for the good of those who love him.', 'Romans 8:28', 'Even in difficult times, God is working behind the scenes to bring good out of every situation.', 'God''s Goodness', CURRENT_DATE + INTERVAL '7 days')
ON CONFLICT (date) DO NOTHING;

-- Step 4: Create the reading streak function
DROP FUNCTION IF EXISTS get_user_reading_streak(UUID);

CREATE OR REPLACE FUNCTION get_user_reading_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    streak_count INTEGER := 0;
    check_date DATE := CURRENT_DATE;
BEGIN
    -- Count consecutive days backwards from today
    WHILE check_date >= CURRENT_DATE - INTERVAL '30 days' LOOP
        -- Check if user completed a verse on this date
        IF EXISTS (
            SELECT 1 
            FROM user_verse_progress 
            WHERE user_id = user_uuid 
            AND verse_date = check_date 
            AND is_completed = true
        ) THEN
            streak_count := streak_count + 1;
            check_date := check_date - INTERVAL '1 day';
        ELSE
            -- Break streak if no verse completed on this date
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$;

-- Step 5: Set up Row Level Security (RLS)
ALTER TABLE user_verse_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_verses ENABLE ROW LEVEL SECURITY;

-- RLS Policy for user_verse_progress
CREATE POLICY "Users can view their own progress" ON user_verse_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_verse_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_verse_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy for favorite_verses
CREATE POLICY "Users can view their own favorites" ON favorite_verses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorite_verses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorite_verses
    FOR DELETE USING (auth.uid() = user_id);

-- Step 6: Grant permissions
GRANT ALL ON user_verse_progress TO authenticated;
GRANT ALL ON favorite_verses TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_reading_streak(UUID) TO authenticated;

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_user_date ON user_verse_progress(user_id, verse_date);
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_date ON user_verse_progress(verse_date);
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user ON favorite_verses(user_id);

-- Success message
SELECT '✅ Daily Bible Verse database setup complete!' as status;
SELECT '📊 Tables created: user_verse_progress, favorite_verses' as tables;
SELECT '🎯 Streak function: get_user_reading_streak' as function;
SELECT '🔒 RLS policies and permissions configured' as security;

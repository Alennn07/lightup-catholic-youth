-- Quiz System Database Schema
-- This script creates the necessary tables for the Faith Challenge quiz system

-- Quiz Progress Table - Tracks user performance across categories
CREATE TABLE IF NOT EXISTS quiz_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    best_score INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    first_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one progress record per user per category
    UNIQUE(user_id, category)
);

-- Quiz Questions Table - Stores all quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL, -- Array of answer options
    correct_answer INTEGER NOT NULL, -- Index of correct answer (0-based)
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Medium', -- Easy, Medium, Hard
    tags TEXT[], -- Array of tags for categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid category
    CONSTRAINT valid_category CHECK (category IN (
        'faith-basics', 'bible-trivia', 'church-history', 
        'modern-faith', 'saints-heroes', 'prayer-worship'
    )),
    
    -- Ensure valid difficulty
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    
    -- Ensure correct_answer is within bounds
    CONSTRAINT valid_correct_answer CHECK (correct_answer >= 0 AND correct_answer < array_length(options, 1))
);

-- Quiz Attempts Table - Detailed tracking of each quiz attempt
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_spent INTEGER DEFAULT 0, -- in seconds
    answers JSONB, -- Store user's answers for review
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid category
    CONSTRAINT valid_category CHECK (category IN (
        'faith-basics', 'bible-trivia', 'church-history', 
        'modern-faith', 'saints-heroes', 'prayer-worship'
    ))
);

-- Quiz Achievements Table - Tracks user achievements
CREATE TABLE IF NOT EXISTS quiz_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one achievement record per user per achievement
    UNIQUE(user_id, achievement_id)
);

-- Quiz Leaderboards Table - Cached leaderboard data for performance
CREATE TABLE IF NOT EXISTS quiz_leaderboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50),
    timeframe VARCHAR(20) NOT NULL, -- all, week, month
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100),
    avatar_url TEXT,
    parish VARCHAR(200),
    best_score INTEGER NOT NULL,
    rank_position INTEGER NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid category and timeframe
    CONSTRAINT valid_category CHECK (category IN (
        'faith-basics', 'bible-trivia', 'church-history', 
        'modern-faith', 'saints-heroes', 'prayer-worship'
    ) OR category IS NULL),
    CONSTRAINT valid_timeframe CHECK (timeframe IN ('all', 'week', 'month'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_id ON quiz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_category ON quiz_progress(category);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_best_score ON quiz_progress(best_score);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_category ON quiz_attempts(category);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_started_at ON quiz_attempts(started_at);

CREATE INDEX IF NOT EXISTS idx_quiz_achievements_user_id ON quiz_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_achievements_achievement_id ON quiz_achievements(achievement_id);

CREATE INDEX IF NOT EXISTS idx_quiz_leaderboards_category ON quiz_leaderboards(category);
CREATE INDEX IF NOT EXISTS idx_quiz_leaderboards_timeframe ON quiz_leaderboards(timeframe);
CREATE INDEX IF NOT EXISTS idx_quiz_leaderboards_rank_position ON quiz_leaderboards(rank_position);

-- Row Level Security (RLS) Policies
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_leaderboards ENABLE ROW LEVEL SECURITY;

-- Quiz Progress RLS Policies
CREATE POLICY "Users can view their own quiz progress" ON quiz_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz progress" ON quiz_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz progress" ON quiz_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Quiz Questions RLS Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view quiz questions" ON quiz_questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Quiz Attempts RLS Policies
CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz Achievements RLS Policies
CREATE POLICY "Users can view their own achievements" ON quiz_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON quiz_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz Leaderboards RLS Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view leaderboards" ON quiz_leaderboards
    FOR SELECT USING (auth.role() = 'authenticated');

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_quiz_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_quiz_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER trigger_update_quiz_progress_updated_at
    BEFORE UPDATE ON quiz_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_quiz_progress_updated_at();

CREATE TRIGGER trigger_update_quiz_questions_updated_at
    BEFORE UPDATE ON quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_quiz_questions_updated_at();

-- Insert sample quiz questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
-- Faith Basics
('faith-basics', 'What are the three theological virtues?', 
 ARRAY['Faith, Hope, and Love', 'Faith, Hope, and Charity', 'Faith, Love, and Joy', 'Faith, Peace, and Love'], 
 1, 'The three theological virtues are Faith, Hope, and Charity (Love). These are gifts from God that help us live in relationship with Him.', 'Easy', ARRAY['virtues', 'theology', 'basics']),

('faith-basics', 'What is the first sacrament we receive?', 
 ARRAY['First Communion', 'Confirmation', 'Baptism', 'Reconciliation'], 
 2, 'Baptism is the first sacrament we receive, which cleanses us from original sin and makes us members of the Church.', 'Easy', ARRAY['sacraments', 'baptism', 'basics']),

('faith-basics', 'How many sacraments are there in the Catholic Church?', 
 ARRAY['5', '6', '7', '8'], 
 2, 'There are 7 sacraments: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony.', 'Easy', ARRAY['sacraments', 'basics', 'count']),

-- Bible Trivia
('bible-trivia', 'How many days and nights did Jesus fast in the desert?', 
 ARRAY['30 days', '40 days', '50 days', '60 days'], 
 1, 'Jesus fasted for 40 days and 40 nights in the desert, just as Moses and Elijah did before Him.', 'Medium', ARRAY['jesus', 'fasting', 'desert', 'bible']),

('bible-trivia', 'What was the name of Jesus'' mother?', 
 ARRAY['Mary', 'Elizabeth', 'Anna', 'Sarah'], 
 0, 'Jesus'' mother was Mary, who was chosen by God to be the Mother of Jesus and is honored as the Mother of God.', 'Easy', ARRAY['mary', 'jesus', 'mother', 'bible']),

('bible-trivia', 'How many apostles did Jesus have?', 
 ARRAY['10', '11', '12', '13'], 
 2, 'Jesus had 12 apostles, representing the 12 tribes of Israel and symbolizing the new people of God.', 'Easy', ARRAY['apostles', 'jesus', 'bible', 'count']);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON quiz_progress TO authenticated;
GRANT SELECT ON quiz_questions TO authenticated;
GRANT SELECT, INSERT ON quiz_attempts TO authenticated;
GRANT SELECT, INSERT ON quiz_achievements TO authenticated;
GRANT SELECT ON quiz_leaderboards TO authenticated;

-- Comments for documentation
COMMENT ON TABLE quiz_progress IS 'Tracks user performance and progress across different quiz categories';
COMMENT ON TABLE quiz_questions IS 'Stores all quiz questions with answers and explanations';
COMMENT ON TABLE quiz_attempts IS 'Detailed tracking of each quiz attempt for analytics';
COMMENT ON TABLE quiz_achievements IS 'Tracks user achievements and badges earned';
COMMENT ON TABLE quiz_leaderboards IS 'Cached leaderboard data for performance optimization';

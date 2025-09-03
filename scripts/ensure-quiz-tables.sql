-- Ensure Quiz Tables Exist with Correct Structure
-- This script creates the quiz tables if they don't exist

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correctAnswer INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Progress Table
CREATE TABLE IF NOT EXISTS quiz_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL,
    best_score INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    first_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_category ON quiz_progress(user_id, category);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_category ON quiz_progress(category);

-- Add RLS policies if they don't exist
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;

-- Quiz questions are readable by everyone
DROP POLICY IF EXISTS "Quiz questions are viewable by everyone" ON quiz_questions;
CREATE POLICY "Quiz questions are viewable by everyone" ON quiz_questions
    FOR SELECT USING (true);

-- Quiz progress is user-specific
DROP POLICY IF EXISTS "Users can view their own quiz progress" ON quiz_progress;
CREATE POLICY "Users can view their own quiz progress" ON quiz_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz progress" ON quiz_progress;
CREATE POLICY "Users can insert their own quiz progress" ON quiz_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own quiz progress" ON quiz_progress;
CREATE POLICY "Users can update their own quiz progress" ON quiz_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Show current table status
SELECT 
    'quiz_questions' as table_name,
    COUNT(*) as row_count
FROM quiz_questions
UNION ALL
SELECT 
    'quiz_progress' as table_name,
    COUNT(*) as row_count
FROM quiz_progress;

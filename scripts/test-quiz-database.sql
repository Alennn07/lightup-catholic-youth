-- Test Quiz Database - Check what's actually in the tables
-- Run this in your Supabase SQL editor to debug the quiz issue

-- Check if tables exist
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('quiz_questions', 'quiz_progress')
ORDER BY table_name, ordinal_position;

-- Check if quiz_questions table has data
SELECT 
    COUNT(*) as total_questions,
    COUNT(CASE WHEN category = 'faith-basics' THEN 1 END) as faith_basics_count,
    COUNT(CASE WHEN category = 'bible-trivia' THEN 1 END) as bible_trivia_count
FROM quiz_questions;

-- Show sample questions to check field names
SELECT 
    id,
    category,
    question,
    options,
    correctAnswer, -- Check if this field exists
    explanation,
    difficulty
FROM quiz_questions 
LIMIT 3;

-- Check if there are any questions with wrong field names
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
AND column_name LIKE '%correct%';

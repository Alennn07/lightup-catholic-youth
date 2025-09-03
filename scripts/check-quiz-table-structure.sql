-- Check the actual structure of the quiz_questions table
-- This will help us see what columns actually exist

-- Check if table exists and get its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
ORDER BY ordinal_position;

-- Also check if there are any existing rows
SELECT COUNT(*) as existing_questions FROM quiz_questions;

-- Show a sample row if any exist
SELECT * FROM quiz_questions LIMIT 1;

-- Fix Quiz Column Names
-- This script ensures the quiz_questions table has the correct column names

-- First, check what columns currently exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
ORDER BY ordinal_position;

-- If the table has 'correct_answer' but we need 'correctAnswer', rename it
-- (This will only work if the column exists)
DO $$
BEGIN
    -- Check if correct_answer column exists and correctAnswer doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quiz_questions' AND column_name = 'correct_answer'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quiz_questions' AND column_name = 'correctAnswer'
    ) THEN
        -- Rename the column
        ALTER TABLE quiz_questions RENAME COLUMN correct_answer TO "correctAnswer";
        RAISE NOTICE 'Renamed correct_answer to correctAnswer';
    ELSE
        RAISE NOTICE 'Column correctAnswer already exists or correct_answer does not exist';
    END IF;
END $$;

-- Show the final structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
ORDER BY ordinal_position;

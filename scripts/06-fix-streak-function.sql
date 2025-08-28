-- Fix the Reading Streak Function - Step 4
-- This fixes the logic to properly calculate streaks

-- Drop the old function
DROP FUNCTION IF EXISTS get_user_reading_streak(UUID);

-- Create the FIXED reading streak function
CREATE OR REPLACE FUNCTION get_user_reading_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    check_date DATE;
    has_today BOOLEAN := false;
BEGIN
    -- First check if user completed a verse today
    SELECT EXISTS (
        SELECT 1 
        FROM user_verse_progress 
        WHERE user_id = user_uuid 
        AND verse_date = current_date 
        AND is_completed = true
    ) INTO has_today;
    
    -- If no verse completed today, return 0
    IF NOT has_today THEN
        RETURN 0;
    END IF;
    
    -- Start from today and count backwards
    check_date := current_date;
    streak_count := 1; -- Start with 1 for today
    
    -- Loop through previous days to count consecutive days
    WHILE check_date > current_date - INTERVAL '30 days' LOOP
        check_date := check_date - INTERVAL '1 day';
        
        -- Check if user completed a verse on this date
        IF EXISTS (
            SELECT 1 
            FROM user_verse_progress 
            WHERE user_id = user_uuid 
            AND verse_date = check_date 
            AND is_completed = true
        ) THEN
            streak_count := streak_count + 1;
        ELSE
            -- Break streak if no verse completed on this date
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak_count;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_reading_streak(UUID) TO authenticated;

-- Test the function (optional)
-- SELECT get_user_reading_streak('0a94ae68-6559-40f9-8b0d-2691b6efcb2b');

-- Success message
SELECT '✅ Reading streak function FIXED successfully!' as status;

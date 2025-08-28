-- SUPER SIMPLE Reading Streak Function - FINAL VERSION
-- This ONLY calculates day streak, nothing else

-- Drop the old function
DROP FUNCTION IF EXISTS get_user_reading_streak(UUID);

-- Create the SIMPLE reading streak function
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_reading_streak(UUID) TO authenticated;

-- Success message
SELECT '✅ Simple streak function created successfully!' as status;

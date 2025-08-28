-- Create Reading Streak Function - Step 3
-- This creates a simple function to calculate user reading streaks

-- Create the reading streak function
CREATE OR REPLACE FUNCTION get_user_reading_streak(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    check_date DATE;
BEGIN
    -- Start from today and count backwards
    check_date := current_date;
    
    -- Loop through dates to count consecutive days
    WHILE check_date >= current_date - INTERVAL '30 days' LOOP
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

-- Test the function (optional)
-- SELECT get_user_reading_streak('00000000-0000-0000-0000-000000000000');

-- Success message
SELECT '✅ Reading streak function created successfully!' as status;

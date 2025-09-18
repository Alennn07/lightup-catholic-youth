-- Verify that all required tables for group sections exist
-- This script checks if the database has all necessary tables

-- Check if group_events table exists and has correct structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_events') THEN
        RAISE NOTICE '✅ group_events table exists';
        
        -- Check required columns
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_events' AND column_name = 'id') THEN
            RAISE NOTICE '✅ group_events.id column exists';
        ELSE
            RAISE NOTICE '❌ group_events.id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_events' AND column_name = 'group_id') THEN
            RAISE NOTICE '✅ group_events.group_id column exists';
        ELSE
            RAISE NOTICE '❌ group_events.group_id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_events' AND column_name = 'title') THEN
            RAISE NOTICE '✅ group_events.title column exists';
        ELSE
            RAISE NOTICE '❌ group_events.title column missing';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ group_events table does not exist';
    END IF;
END $$;

-- Check if group_posts table exists and has correct structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_posts') THEN
        RAISE NOTICE '✅ group_posts table exists';
        
        -- Check required columns
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_posts' AND column_name = 'id') THEN
            RAISE NOTICE '✅ group_posts.id column exists';
        ELSE
            RAISE NOTICE '❌ group_posts.id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_posts' AND column_name = 'group_id') THEN
            RAISE NOTICE '✅ group_posts.group_id column exists';
        ELSE
            RAISE NOTICE '❌ group_posts.group_id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_posts' AND column_name = 'content') THEN
            RAISE NOTICE '✅ group_posts.content column exists';
        ELSE
            RAISE NOTICE '❌ group_posts.content column missing';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ group_posts table does not exist';
    END IF;
END $$;

-- Check if group_members table exists and has correct structure
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_members') THEN
        RAISE NOTICE '✅ group_members table exists';
        
        -- Check required columns
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_members' AND column_name = 'id') THEN
            RAISE NOTICE '✅ group_members.id column exists';
        ELSE
            RAISE NOTICE '❌ group_members.id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_members' AND column_name = 'group_id') THEN
            RAISE NOTICE '✅ group_members.group_id column exists';
        ELSE
            RAISE NOTICE '❌ group_members.group_id column missing';
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'group_members' AND column_name = 'user_id') THEN
            RAISE NOTICE '✅ group_members.user_id column exists';
        ELSE
            RAISE NOTICE '❌ group_members.user_id column missing';
        END IF;
        
    ELSE
        RAISE NOTICE '❌ group_members table does not exist';
    END IF;
END $$;

-- Check if youth_groups table has category_id column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youth_groups' AND column_name = 'category_id') THEN
        RAISE NOTICE '✅ youth_groups.category_id column exists';
    ELSE
        RAISE NOTICE '❌ youth_groups.category_id column missing - run add-group-categories.sql';
    END IF;
END $$;

-- Check if group_categories table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_categories') THEN
        RAISE NOTICE '✅ group_categories table exists';
    ELSE
        RAISE NOTICE '❌ group_categories table does not exist - run add-group-categories.sql';
    END IF;
END $$;

-- Summary
SELECT 'Database verification complete. Check the notices above for any missing tables or columns.' as summary;

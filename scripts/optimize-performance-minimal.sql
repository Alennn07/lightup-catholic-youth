-- MINIMAL PERFORMANCE OPTIMIZATION SCRIPT
-- Only includes essential indexes for core functionality
-- This script is guaranteed to work with your current database

-- 1. Most important index for daily Bible verse feature
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_user_date_completed 
ON user_verse_progress (user_id, verse_date, is_completed);

-- 2. General user verse progress queries
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_user_id 
ON user_verse_progress (user_id);

-- 3. Date-based queries for user verse progress
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_verse_date 
ON user_verse_progress (verse_date);

-- 4. Index for read at (for timestamp queries)
CREATE INDEX IF NOT EXISTS idx_user_verse_progress_read_at 
ON user_verse_progress (read_at);

-- 5. Journal entries by user and creation time
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created 
ON journal_entries (user_id, created_at);

-- 6. Quiz questions by category
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category 
ON quiz_questions (category);

-- 7. Users by email (for authentication lookups)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- 8. Youth groups by creation time
CREATE INDEX IF NOT EXISTS idx_youth_groups_created 
ON youth_groups (created_at);

-- 9. Events by date
CREATE INDEX IF NOT EXISTS idx_events_date 
ON events (date);

-- 10. Prayer requests by user and creation time
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_created 
ON prayer_requests (user_id, created_at);

-- 11. Prayer requests by category
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category 
ON prayer_requests (category);

-- 12. Prayer responses by prayer request
CREATE INDEX IF NOT EXISTS idx_prayer_responses_request 
ON prayer_responses (prayer_request_id);

-- 13. Youth group members by group
CREATE INDEX IF NOT EXISTS idx_youth_group_members_group 
ON youth_group_members (group_id);

-- 14. Youth group members by user
CREATE INDEX IF NOT EXISTS idx_youth_group_members_user 
ON youth_group_members (user_id);

-- 15. User activities by user and creation time
CREATE INDEX IF NOT EXISTS idx_user_activities_user_created 
ON user_activities (user_id, created_at);

-- 16. Quiz progress by user and category
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_category 
ON quiz_progress (user_id, category);

-- 17. Group events by group
CREATE INDEX IF NOT EXISTS idx_group_events_group 
ON group_events (group_id);

-- 18. Group events by date
CREATE INDEX IF NOT EXISTS idx_group_events_date 
ON group_events (event_date);

-- 19. Event registrations by event
CREATE INDEX IF NOT EXISTS idx_event_registrations_event 
ON event_registrations (event_id);

-- 20. Event registrations by user
CREATE INDEX IF NOT EXISTS idx_event_registrations_user 
ON event_registrations (user_id);

-- 21. Bible verse readings by user
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_user 
ON bible_verse_readings (user_id);

-- 22. Bible verse readings by creation time
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_created 
ON bible_verse_readings (created_at);

-- 23. Feature feedback by feature
CREATE INDEX IF NOT EXISTS idx_feature_feedback_feature 
ON feature_feedback (feature_id);

-- 24. Feature feedback by user
CREATE INDEX IF NOT EXISTS idx_feature_feedback_user 
ON feature_feedback (user_id);

-- 25. Testimonials by user
CREATE INDEX IF NOT EXISTS idx_testimonials_user 
ON testimonials (user_id);

-- 26. Apps by category
CREATE INDEX IF NOT EXISTS idx_apps_category 
ON apps (category);

-- Analyze core tables for query optimization
ANALYZE users;
ANALYZE prayer_requests;
ANALYZE journal_entries;
ANALYZE youth_groups;
ANALYZE events;
ANALYZE quiz_questions;
ANALYZE quiz_progress;
ANALYZE user_activities;
ANALYZE user_verse_progress;
ANALYZE youth_group_members;
ANALYZE prayer_responses;
ANALYZE group_events;
ANALYZE event_registrations;
ANALYZE bible_verse_readings;
ANALYZE feature_feedback;
ANALYZE testimonials;
ANALYZE apps;

-- Show all indexes created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN (
        'users',
        'prayer_requests',
        'journal_entries',
        'youth_groups',
        'events',
        'quiz_questions',
        'quiz_progress',
        'user_activities',
        'user_verse_progress',
        'youth_group_members',
        'prayer_responses',
        'group_events',
        'event_registrations',
        'bible_verse_readings',
        'feature_feedback',
        'testimonials',
        'apps'
    )
ORDER BY tablename, indexname;

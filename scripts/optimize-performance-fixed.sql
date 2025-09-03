-- PERFORMANCE OPTIMIZATION SCRIPT
-- This script adds database indexes and optimizations for faster queries
-- Only includes tables that actually exist in the database

-- 1. Most important index for daily Bible verse feature
-- This will make the daily verse queries much faster
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date_completed 
ON user_progress (user_id, verse_date, is_completed);

-- 2. General user progress queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
ON user_progress (user_id);

-- 3. Date-based queries for user progress
CREATE INDEX IF NOT EXISTS idx_user_progress_verse_date 
ON user_progress (verse_date);

-- 4. Index for completed at (for timestamp queries)
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at 
ON user_progress (completed_at);

-- 5. Journal entries by user and creation time
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created 
ON journal_entries (user_id, created_at);

-- 7. Quiz questions by category
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category 
ON quiz_questions (category);

-- 8. Users by email (for authentication lookups)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- 9. Youth groups by creation time
CREATE INDEX IF NOT EXISTS idx_youth_groups_created 
ON youth_groups (created_at);

-- 10. Events by date
CREATE INDEX IF NOT EXISTS idx_events_date 
ON events (date);

-- 11. Prayer requests by user and creation time
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_created 
ON prayer_requests (user_id, created_at);

-- 12. Prayer requests by category
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category 
ON prayer_requests (category);

-- 13. Prayer responses by prayer request
CREATE INDEX IF NOT EXISTS idx_prayer_responses_request 
ON prayer_responses (prayer_request_id);

-- 14. Youth group members by group
CREATE INDEX IF NOT EXISTS idx_youth_group_members_group 
ON youth_group_members (group_id);

-- 15. Youth group members by user
CREATE INDEX IF NOT EXISTS idx_youth_group_members_user 
ON youth_group_members (user_id);

-- 16. User activities by user and creation time
CREATE INDEX IF NOT EXISTS idx_user_activities_user_created 
ON user_activities (user_id, created_at);

-- 17. User insights by user
CREATE INDEX IF NOT EXISTS idx_user_insights_user 
ON user_insights (user_id);

-- 18. Prayer sessions by user
CREATE INDEX IF NOT EXISTS idx_prayer_sessions_user 
ON prayer_sessions (user_id);

-- 19. Weekly challenges by user
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_user 
ON weekly_challenges (user_id);

-- 20. Quiz progress by user and category
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_category 
ON quiz_progress (user_id, category);

-- 21. Quiz attempts by user
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user 
ON quiz_attempts (user_id);

-- 22. Quiz achievements by user
CREATE INDEX IF NOT EXISTS idx_quiz_achievements_user 
ON quiz_achievements (user_id);

-- 23. Group events by group
CREATE INDEX IF NOT EXISTS idx_group_events_group 
ON group_events (group_id);

-- 24. Group events by date
CREATE INDEX IF NOT EXISTS idx_group_events_date 
ON group_events (event_date);

-- 25. Group posts by group
CREATE INDEX IF NOT EXISTS idx_group_posts_group 
ON group_posts (group_id);

-- 26. Event registrations by event
CREATE INDEX IF NOT EXISTS idx_event_registrations_event 
ON event_registrations (event_id);

-- 27. Event registrations by user
CREATE INDEX IF NOT EXISTS idx_event_registrations_user 
ON event_registrations (user_id);

-- 28. Error logs by timestamp
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp 
ON error_logs (timestamp);

-- 29. Error logs by severity
CREATE INDEX IF NOT EXISTS idx_error_logs_severity 
ON error_logs (severity);

-- 30. Security logs by timestamp
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp 
ON security_logs (timestamp);

-- 31. Security logs by event type
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type 
ON security_logs (event_type);

-- 32. Bible verse readings by user
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_user 
ON bible_verse_readings (user_id);

-- 33. Bible verse readings by creation time
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_created 
ON bible_verse_readings (created_at);

-- 34. Feature feedback by feature
CREATE INDEX IF NOT EXISTS idx_feature_feedback_feature 
ON feature_feedback (feature_id);

-- 35. Feature feedback by user
CREATE INDEX IF NOT EXISTS idx_feature_feedback_user 
ON feature_feedback (user_id);

-- 36. Testimonials by user
CREATE INDEX IF NOT EXISTS idx_testimonials_user 
ON testimonials (user_id);

-- 37. Apps by category
CREATE INDEX IF NOT EXISTS idx_apps_category 
ON apps (category);

-- 38. User activity by user and creation time
CREATE INDEX IF NOT EXISTS idx_user_activity_user_created 
ON user_activity (user_id, created_at);

-- Analyze tables for query optimization
ANALYZE users;
ANALYZE prayer_requests;
ANALYZE journal_entries;
ANALYZE youth_groups;
ANALYZE events;
ANALYZE quiz_questions;
ANALYZE quiz_progress;
ANALYZE user_activities;
ANALYZE user_activity;
ANALYZE user_insights;
ANALYZE prayer_sessions;
ANALYZE weekly_challenges;
ANALYZE group_events;
ANALYZE group_posts;
ANALYZE event_registrations;
ANALYZE error_logs;
ANALYZE security_logs;
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
        'user_activity',
        'user_insights',
        'prayer_sessions',
        'weekly_challenges',
        'group_events',
        'group_posts',
        'event_registrations',
        'error_logs',
        'security_logs',
        'bible_verse_readings',
        'feature_feedback',
        'testimonials',
        'apps',
        'youth_group_members',
        'prayer_responses',
        'quiz_attempts',
        'quiz_achievements',
        'quiz_leaderboards',
        'group_members',
        'features'
    )
ORDER BY tablename, indexname;

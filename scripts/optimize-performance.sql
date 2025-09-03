-- 🚀 PERFORMANCE OPTIMIZATION SCRIPT
-- This script adds database indexes and optimizations for faster queries

-- 1. Add composite index for user_progress table (most important for daily verse)
-- This will make the daily verse queries much faster
CREATE INDEX IF NOT EXISTS idx_user_progress_user_date_completed 
ON user_progress (user_id, verse_date, is_completed);

-- 2. Add index for user_id alone (for general user queries)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id 
ON user_progress (user_id);

-- 3. Add index for verse_date (for date-based queries)
CREATE INDEX IF NOT EXISTS idx_user_progress_verse_date 
ON user_progress (verse_date);

-- 4. Add index for completed_at (for timestamp queries)
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at 
ON user_progress (completed_at);

-- 5. Add composite index for journal entries (for Faith Journal)
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date 
ON journal_entries (user_id, entry_date);

-- 6. Add index for journal search functionality
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created 
ON journal_entries (user_id, created_at);

-- 7. Add index for quiz questions by category
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category 
ON quiz_questions (category);

-- 8. Add index for user authentication (if you have a users table)
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 9. Add index for youth groups
CREATE INDEX IF NOT EXISTS idx_youth_groups_created 
ON youth_groups (created_at);

-- 10. Add index for events
CREATE INDEX IF NOT EXISTS idx_events_date 
ON events (date);

-- 11. Add index for prayer requests
CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_created 
ON prayer_requests (user_id, created_at);

-- 12. Add index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON notifications (user_id, is_read);

-- 13. Add index for users (primary key is already indexed, but adding email index for lookups)
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (email);

-- 14. Add index for youth group members by group
CREATE INDEX IF NOT EXISTS idx_youth_group_members_group 
ON youth_group_members (group_id);

-- 15. Add index for youth group members by user
CREATE INDEX IF NOT EXISTS idx_youth_group_members_user 
ON youth_group_members (user_id);

-- 16. Add index for prayer responses by prayer request
CREATE INDEX IF NOT EXISTS idx_prayer_responses_request 
ON prayer_responses (prayer_request_id);

-- 17. Add index for user activities by user and creation time
CREATE INDEX IF NOT EXISTS idx_user_activities_user_created 
ON user_activities (user_id, created_at);

-- 18. Add index for user insights by user
CREATE INDEX IF NOT EXISTS idx_user_insights_user 
ON user_insights (user_id);

-- 19. Add index for prayer sessions by user
CREATE INDEX IF NOT EXISTS idx_prayer_sessions_user 
ON prayer_sessions (user_id);

-- 20. Add index for weekly challenges by user
CREATE INDEX IF NOT EXISTS idx_weekly_challenges_user 
ON weekly_challenges (user_id);

-- 21. Add index for quiz progress by user and category
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_category 
ON quiz_progress (user_id, category);

-- 22. Add index for quiz attempts by user
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user 
ON quiz_attempts (user_id);

-- 23. Add index for quiz achievements by user
CREATE INDEX IF NOT EXISTS idx_quiz_achievements_user 
ON quiz_achievements (user_id);

-- 24. Add index for group events by group
CREATE INDEX IF NOT EXISTS idx_group_events_group 
ON group_events (group_id);

-- 25. Add index for group events by date
CREATE INDEX IF NOT EXISTS idx_group_events_date 
ON group_events (event_date);

-- 26. Add index for group posts by group
CREATE INDEX IF NOT EXISTS idx_group_posts_group 
ON group_posts (group_id);

-- 27. Add index for event registrations by event
CREATE INDEX IF NOT EXISTS idx_event_registrations_event 
ON event_registrations (event_id);

-- 28. Add index for event registrations by user
CREATE INDEX IF NOT EXISTS idx_event_registrations_user 
ON event_registrations (user_id);

-- 29. Add index for error logs by timestamp
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp 
ON error_logs (timestamp);

-- 30. Add index for error logs by severity
CREATE INDEX IF NOT EXISTS idx_error_logs_severity 
ON error_logs (severity);

-- 31. Add index for security logs by timestamp
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp 
ON security_logs (timestamp);

-- 32. Add index for security logs by event type
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type 
ON security_logs (event_type);

-- 33. Add index for bible verse readings by user
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_user 
ON bible_verse_readings (user_id);

-- 34. Add index for bible verse readings by date
CREATE INDEX IF NOT EXISTS idx_bible_verse_readings_date 
ON bible_verse_readings (reading_date);

-- 35. Add index for feature feedback by feature
CREATE INDEX IF NOT EXISTS idx_feature_feedback_feature 
ON feature_feedback (feature_id);

-- 36. Add index for feature feedback by user
CREATE INDEX IF NOT EXISTS idx_feature_feedback_user 
ON feature_feedback (user_id);

-- 37. Add index for testimonials by user
CREATE INDEX IF NOT EXISTS idx_testimonials_user 
ON testimonials (user_id);

-- 38. Add index for apps by category
CREATE INDEX IF NOT EXISTS idx_apps_category 
ON apps (category);

-- 39. Add index for user activity by user and creation time
CREATE INDEX IF NOT EXISTS idx_user_activity_user_created 
ON user_activity (user_id, created_at);

-- 🚀 ANALYZE TABLES for better query planning
ANALYZE user_progress;
ANALYZE journal_entries;
ANALYZE quiz_questions;
ANALYZE youth_groups;
ANALYZE events;
ANALYZE prayer_requests;
ANALYZE users;
ANALYZE youth_group_members;
ANALYZE prayer_responses;
ANALYZE user_activities;
ANALYZE user_insights;
ANALYZE prayer_sessions;
ANALYZE weekly_challenges;
ANALYZE quiz_progress;
ANALYZE quiz_attempts;
ANALYZE quiz_achievements;
ANALYZE group_events;
ANALYZE group_posts;
ANALYZE event_registrations;
ANALYZE error_logs;
ANALYZE security_logs;
ANALYZE bible_verse_readings;
ANALYZE feature_feedback;
ANALYZE testimonials;
ANALYZE apps;
ANALYZE user_activity;

-- 🚀 VACUUM TABLES for better performance
VACUUM ANALYZE user_progress;
VACUUM ANALYZE journal_entries;
VACUUM ANALYZE quiz_questions;
VACUUM ANALYZE youth_groups;
VACUUM ANALYZE events;
VACUUM ANALYZE prayer_requests;
VACUUM ANALYZE users;
VACUUM ANALYZE youth_group_members;
VACUUM ANALYZE prayer_responses;
VACUUM ANALYZE user_activities;
VACUUM ANALYZE user_insights;
VACUUM ANALYZE prayer_sessions;
VACUUM ANALYZE weekly_challenges;
VACUUM ANALYZE quiz_progress;
VACUUM ANALYZE quiz_attempts;
VACUUM ANALYZE quiz_achievements;
VACUUM ANALYZE group_events;
VACUUM ANALYZE group_posts;
VACUUM ANALYZE event_registrations;
VACUUM ANALYZE error_logs;
VACUUM ANALYZE security_logs;
VACUUM ANALYZE bible_verse_readings;
VACUUM ANALYZE feature_feedback;
VACUUM ANALYZE testimonials;
VACUUM ANALYZE apps;
VACUUM ANALYZE user_activity;

-- 🚀 SHOW INDEXES for verification
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN (
    'user_progress',
    'journal_entries',
    'quiz_questions',
    'youth_groups',
    'events',
    'prayer_requests',

    'users',

    'youth_group_members',
    'prayer_responses',
    'user_activities',
    'user_insights',
    'prayer_sessions',
    'weekly_challenges',
    'quiz_progress',
    'quiz_attempts',
    'quiz_achievements',
    'group_events',
    'group_posts',
    'event_registrations',
    'error_logs',
    'security_logs',
    'bible_verse_readings',
    'feature_feedback',
    'testimonials',
    'apps',
    'user_activity'
)
ORDER BY tablename, indexname;

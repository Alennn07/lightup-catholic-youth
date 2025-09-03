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

-- 14. Add index for user settings
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id 
ON user_settings (user_id);

-- 15. Add index for user achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_created 
ON user_achievements (user_id, created_at);

-- 16. Add index for user badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_created 
ON user_badges (user_id, created_at);

-- 17. Add index for user friends/followers
CREATE INDEX IF NOT EXISTS idx_user_relationships_user 
ON user_relationships (user_id);

-- 18. Add index for user posts
CREATE INDEX IF NOT EXISTS idx_user_posts_user_created 
ON user_posts (user_id, created_at);

-- 19. Add index for user comments
CREATE INDEX IF NOT EXISTS idx_user_comments_user_created 
ON user_comments (user_id, created_at);

-- 20. Add index for user likes
CREATE INDEX IF NOT EXISTS idx_user_likes_user_created 
ON user_likes (user_id, created_at);

-- 21. Add index for user shares
CREATE INDEX IF NOT EXISTS idx_user_shares_user_created 
ON user_shares (user_id, created_at);

-- 22. Add index for user bookmarks
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_created 
ON user_bookmarks (user_id, created_at);

-- 23. Add index for user notes
CREATE INDEX IF NOT EXISTS idx_user_notes_user_created 
ON user_notes (user_id, created_at);

-- 24. Add index for user goals
CREATE INDEX IF NOT EXISTS idx_user_goals_user_created 
ON user_goals (user_id, created_at);

-- 25. Add index for user habits
CREATE INDEX IF NOT EXISTS idx_user_habits_user_created 
ON user_habits (user_id, created_at);

-- 26. Add index for user moods
CREATE INDEX IF NOT EXISTS idx_user_moods_user_created 
ON user_moods (user_id, created_at);

-- 27. Add index for user prayers
CREATE INDEX IF NOT EXISTS idx_user_prayers_user_created 
ON user_prayers (user_id, created_at);

-- 28. Add index for user reflections
CREATE INDEX IF NOT EXISTS idx_user_reflections_user_created 
ON user_reflections (user_id, created_at);

-- 29. Add index for user gratitude
CREATE INDEX IF NOT EXISTS idx_user_gratitude_user_created 
ON user_gratitude (user_id, created_at);

-- 30. Add index for user challenges
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_created 
ON user_challenges (user_id, created_at);

-- 🚀 ANALYZE TABLES for better query planning
ANALYZE user_progress;
ANALYZE journal_entries;
ANALYZE quiz_questions;
ANALYZE youth_groups;
ANALYZE events;
ANALYZE prayer_requests;
ANALYZE notifications;
ANALYZE users;
ANALYZE user_settings;
ANALYZE user_achievements;
ANALYZE user_badges;
ANALYZE user_relationships;
ANALYZE user_posts;
ANALYZE user_comments;
ANALYZE user_likes;
ANALYZE user_shares;
ANALYZE user_bookmarks;
ANALYZE user_notes;
ANALYZE user_goals;
ANALYZE user_habits;
ANALYZE user_moods;
ANALYZE user_prayers;
ANALYZE user_reflections;
ANALYZE user_gratitude;
ANALYZE user_challenges;

-- 🚀 VACUUM TABLES for better performance
VACUUM ANALYZE user_progress;
VACUUM ANALYZE journal_entries;
VACUUM ANALYZE quiz_questions;
VACUUM ANALYZE youth_groups;
VACUUM ANALYZE events;
VACUUM ANALYZE prayer_requests;
VACUUM ANALYZE notifications;
VACUUM ANALYZE users;
VACUUM ANALYZE user_settings;
VACUUM ANALYZE user_achievements;
VACUUM ANALYZE user_badges;
VACUUM ANALYZE user_relationships;
VACUUM ANALYZE user_posts;
VACUUM ANALYZE user_comments;
VACUUM ANALYZE user_likes;
VACUUM ANALYZE user_shares;
VACUUM ANALYZE user_bookmarks;
VACUUM ANALYZE user_notes;
VACUUM ANALYZE user_goals;
VACUUM ANALYZE user_habits;
VACUUM ANALYZE user_moods;
VACUUM ANALYZE user_prayers;
VACUUM ANALYZE user_reflections;
VACUUM ANALYZE user_gratitude;
VACUUM ANALYZE user_challenges;

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
    'notifications',
    'users',
    'user_settings',
    'user_achievements',
    'user_badges',
    'user_relationships',
    'user_posts',
    'user_comments',
    'user_likes',
    'user_shares',
    'user_bookmarks',
    'user_notes',
    'user_goals',
    'user_habits',
    'user_moods',
    'user_prayers',
    'user_reflections',
    'user_gratitude',
    'user_challenges'
)
ORDER BY tablename, indexname;

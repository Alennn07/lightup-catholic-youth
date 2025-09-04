-- Add sample data for search testing
-- This script adds sample data to make search functionality more comprehensive

-- Add sample youth groups
INSERT INTO youth_groups (id, name, description, location, is_public, member_count, created_at)
VALUES 
  (gen_random_uuid(), 'Young Adults Group', 'A vibrant community for young adults aged 18-30 to grow in faith together through prayer, study, and fellowship.', 'St. Mary Church, Downtown', true, 25, NOW()),
  (gen_random_uuid(), 'Teen Faith Group', 'High school students exploring their faith through discussions, activities, and service projects.', 'St. Joseph Parish, Westside', true, 18, NOW()),
  (gen_random_uuid(), 'Campus Ministry', 'College students building community and deepening their relationship with God through weekly meetings and retreats.', 'University Campus', true, 32, NOW()),
  (gen_random_uuid(), 'Family Faith Group', 'Families with children of all ages coming together to learn and grow in faith as a community.', 'St. Francis Church, Eastside', true, 15, NOW()),
  (gen_random_uuid(), 'Young Professionals', 'Working young adults balancing career and faith, supporting each other through life challenges.', 'Downtown Community Center', true, 22, NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample events
INSERT INTO events (id, title, description, location, date, is_public, created_at)
VALUES 
  (gen_random_uuid(), 'Youth Retreat 2024', 'A weekend retreat focused on spiritual growth, community building, and deepening our relationship with God.', 'Camp St. John, Mountain View', '2024-03-15 09:00:00', true, NOW()),
  (gen_random_uuid(), 'Community Service Day', 'Join us for a day of service in our local community. We will be helping at the food bank and visiting elderly residents.', 'Various Locations', '2024-02-20 08:00:00', true, NOW()),
  (gen_random_uuid(), 'Bible Study Series', 'A 6-week study of the Gospel of Matthew. All are welcome to join us for discussion and reflection.', 'St. Mary Church Hall', '2024-02-01 19:00:00', true, NOW()),
  (gen_random_uuid(), 'Praise and Worship Night', 'An evening of music, prayer, and worship. Bring your friends and family for an uplifting experience.', 'St. Joseph Church', '2024-02-10 19:30:00', true, NOW()),
  (gen_random_uuid(), 'Faith and Science Discussion', 'Exploring the relationship between faith and science with guest speakers and open dialogue.', 'University Auditorium', '2024-02-25 18:00:00', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Add more sample prayer requests
INSERT INTO prayer_requests (id, user_id, name, request, category, is_anonymous, prayer_count, created_at)
VALUES 
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Sarah', 'Please pray for my job interview tomorrow. I really need this position to support my family.', 'Work', false, 3, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Michael', 'Praying for healing for my grandmother who is recovering from surgery. May God grant her strength and peace.', 'Health', false, 7, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Anonymous', 'Please pray for all the homeless people in our city. May they find shelter, food, and hope.', 'Spiritual', true, 12, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Lisa', 'Praying for my daughter who is struggling with anxiety. May God give her peace and courage.', 'Family', false, 5, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'David', 'Please pray for our youth group as we plan our upcoming retreat. May it be a meaningful experience for everyone.', 'Spiritual', false, 8, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Anonymous', 'Praying for world peace and an end to violence and conflict everywhere.', 'Spiritual', true, 15, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'Maria', 'Please pray for my son who is starting college next week. May God guide him and protect him.', 'Family', false, 6, NOW()),
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'John', 'Praying for all the teachers and students as the new school year begins. May it be a year of growth and learning.', 'Education', false, 4, NOW())
ON CONFLICT (id) DO NOTHING;

-- Add sample journal entries (only if user exists)
DO $$
DECLARE
    user_id_var UUID;
BEGIN
    -- Get a user ID
    SELECT id INTO user_id_var FROM users LIMIT 1;
    
    IF user_id_var IS NOT NULL THEN
        INSERT INTO journal_entries (id, user_id, title, content, mood, tags, entry_date, is_private, created_at)
        VALUES 
          (gen_random_uuid(), user_id_var, 'Grateful for Today', 'Today I felt so blessed. The sun was shining, and I had a wonderful conversation with my grandmother. She shared stories about her faith journey that really inspired me.', 'grateful', ARRAY['gratitude', 'family', 'faith'], '2024-01-15', false, NOW()),
          (gen_random_uuid(), user_id_var, 'Struggling with Doubts', 'I have been questioning my faith lately. Sometimes I wonder if God is really listening to my prayers. I need guidance and strength to overcome these doubts.', 'struggling', ARRAY['doubts', 'prayer', 'guidance'], '2024-01-20', true, NOW()),
          (gen_random_uuid(), user_id_var, 'Amazing Youth Group Meeting', 'Our youth group had an incredible discussion about social justice today. I learned so much about how our faith calls us to serve others and work for a better world.', 'joyful', ARRAY['youth group', 'social justice', 'community'], '2024-01-25', false, NOW()),
          (gen_random_uuid(), user_id_var, 'Prayer Answered', 'I have been praying for my friend who was sick, and today I found out she is getting better! God is so good and faithful.', 'hopeful', ARRAY['healing', 'prayer', 'friendship'], '2024-01-30', false, NOW()),
          (gen_random_uuid(), user_id_var, 'Reflecting on Lent', 'As Lent begins, I am reflecting on what I can give up and what I can do to grow closer to God. This season always brings me peace and renewal.', 'contemplative', ARRAY['Lent', 'reflection', 'spiritual growth'], '2024-02-01', false, NOW())
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_prayer_requests_search ON prayer_requests USING gin(to_tsvector('english', name || ' ' || request || ' ' || category));
CREATE INDEX IF NOT EXISTS idx_journal_entries_search ON journal_entries USING gin(to_tsvector('english', title || ' ' || content || ' ' || mood));
CREATE INDEX IF NOT EXISTS idx_youth_groups_search ON youth_groups USING gin(to_tsvector('english', name || ' ' || description || ' ' || location));
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || description || ' ' || location));

-- Create regular indexes for ILIKE searches
CREATE INDEX IF NOT EXISTS idx_prayer_requests_name ON prayer_requests (name);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_request ON prayer_requests (request);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_category ON prayer_requests (category);
CREATE INDEX IF NOT EXISTS idx_journal_entries_title ON journal_entries (title);
CREATE INDEX IF NOT EXISTS idx_journal_entries_content ON journal_entries (content);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journal_entries (mood);
CREATE INDEX IF NOT EXISTS idx_youth_groups_name ON youth_groups (name);
CREATE INDEX IF NOT EXISTS idx_youth_groups_description ON youth_groups (description);
CREATE INDEX IF NOT EXISTS idx_youth_groups_location ON youth_groups (location);
CREATE INDEX IF NOT EXISTS idx_events_title ON events (title);
CREATE INDEX IF NOT EXISTS idx_events_description ON events (description);
CREATE INDEX IF NOT EXISTS idx_events_location ON events (location);

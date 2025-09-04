-- Fix database tables for search functionality
-- Add missing columns to youth_groups and events tables

-- Add missing columns to youth_groups table
ALTER TABLE youth_groups 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add missing columns to events table  
ALTER TABLE events
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_youth_groups_location ON youth_groups (location);
CREATE INDEX IF NOT EXISTS idx_youth_groups_is_public ON youth_groups (is_public);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON events (is_public);

-- Insert sample youth groups data (without specifying id - let it auto-increment)
INSERT INTO youth_groups (name, description, location, is_public, member_count, created_at)
VALUES 
  ('Young Adults Group', 'A vibrant community for young adults aged 18-30 to grow in faith together through prayer, study, and fellowship.', 'St. Mary Church, Downtown', true, 25, NOW()),
  ('Teen Faith Group', 'High school students exploring their faith through discussions, activities, and service projects.', 'St. Joseph Parish, Westside', true, 18, NOW()),
  ('Campus Ministry', 'College students building community and deepening their relationship with God through weekly meetings and retreats.', 'University Campus', true, 32, NOW()),
  ('Family Faith Group', 'Families with children of all ages coming together to learn and grow in faith as a community.', 'St. Francis Church, Eastside', true, 15, NOW()),
  ('Young Professionals', 'Working young adults balancing career and faith, supporting each other through life challenges.', 'Downtown Community Center', true, 22, NOW());

-- Insert sample events data (with all required columns)
INSERT INTO events (title, type, date, location, max_attendees, attendees, description, owner_id, owner_email, is_public, created_at)
VALUES 
  ('Youth Retreat 2024', 'Retreat', '2024-03-15', 'Camp St. John, Mountain View', 50, 0, 'A weekend retreat focused on spiritual growth, community building, and deepening our relationship with God.', (SELECT id FROM auth.users LIMIT 1), 'admin@lightup.com', true, NOW()),
  ('Community Service Day', 'Service', '2024-02-20', 'Various Locations', 30, 0, 'Join us for a day of service in our local community. We will be helping at the food bank and visiting elderly residents.', (SELECT id FROM auth.users LIMIT 1), 'admin@lightup.com', true, NOW()),
  ('Bible Study Series', 'Study', '2024-02-01', 'St. Mary Church Hall', 25, 0, 'A 6-week study of the Gospel of Matthew. All are welcome to join us for discussion and reflection.', (SELECT id FROM auth.users LIMIT 1), 'admin@lightup.com', true, NOW()),
  ('Praise and Worship Night', 'Worship', '2024-02-10', 'St. Joseph Church', 100, 0, 'An evening of music, prayer, and worship. Bring your friends and family for an uplifting experience.', (SELECT id FROM auth.users LIMIT 1), 'admin@lightup.com', true, NOW()),
  ('Faith and Science Discussion', 'Discussion', '2024-02-25', 'University Auditorium', 80, 0, 'Exploring the relationship between faith and science with guest speakers and open dialogue.', (SELECT id FROM auth.users LIMIT 1), 'admin@lightup.com', true, NOW());

-- Script 2: Insert Data Only
-- Run this SECOND after Script 1 succeeds

-- Insert sample Bible verses
INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('John 3:16', 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 'John', 3, 16, 'Love', 'God''s love is unconditional and eternal. He gave everything for us. How can you show this kind of love to others today?', 'Tell someone you love them today');

INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('Proverbs 17:17', 'A friend loves at all times, and a brother is born for a time of adversity.', 'Proverbs', 17, 17, 'Friendship', 'True friends stick with you through the good times and the bad. They''re the ones who celebrate your victories and pick you up when you fall.', 'Reach out to a friend who might be going through a hard time');

INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('Philippians 4:13', 'I can do all this through him who gives me strength.', 'Philippians', 4, 13, 'Strength', 'With God''s help, you can overcome any challenge. His strength is available to you every day.', 'Face a difficult situation with confidence today');

INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('Psalm 119:105', 'Your word is a lamp for my feet, a light on my path.', 'Psalms', 119, 105, 'Guidance', 'God''s Word guides us like a flashlight in the dark. It shows us the right way to go.', 'Read a Bible verse and think about how it guides you');

INSERT INTO bible_verses (verse_id, verse_text, book, chapter, verse, theme, reflection, action_prompt) VALUES
('Matthew 28:19', 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.', 'Matthew', 28, 19, 'Mission', 'Jesus calls us to share His love with others. You don''t need to travel far to make a difference.', 'Share your faith with one person today');

-- Insert today's verse assignment
INSERT INTO daily_verse_assignments (verse_id, assigned_date, theme) VALUES
('Proverbs 17:17', CURRENT_DATE, 'Friendship')
ON CONFLICT (assigned_date) DO NOTHING;

-- Success message
SELECT 'Data inserted successfully!' as status;

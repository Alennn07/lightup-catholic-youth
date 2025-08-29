-- Fix Quiz Tables - Drop and recreate with correct field names
-- Run this in your Supabase SQL editor to fix the field name mismatch

-- Drop existing tables to recreate them properly
DROP TABLE IF EXISTS quiz_progress CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;

-- Quiz Progress Table - Tracks user performance across categories
CREATE TABLE quiz_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL,
    best_score INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    first_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one progress record per user per category
    UNIQUE(user_id, category)
);

-- Quiz Questions Table - Stores all quiz questions with correct field names
CREATE TABLE quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correctAnswer INTEGER NOT NULL, -- This matches the frontend expectation
    explanation TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'Medium',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_quiz_progress_user_id ON quiz_progress(user_id);
CREATE INDEX idx_quiz_progress_category ON quiz_progress(category);
CREATE INDEX idx_quiz_questions_category ON quiz_questions(category);

-- Insert sample questions for Faith Fundamentals category
INSERT INTO quiz_questions (category, question, options, correctAnswer, explanation, difficulty, tags) VALUES
('faith-basics', 'What are the three theological virtues?', 
 ARRAY['Faith, Hope, and Love', 'Faith, Hope, and Charity', 'Faith, Love, and Joy', 'Faith, Peace, and Love'], 
 1, 
 'The three theological virtues are Faith, Hope, and Charity (Love). These are gifts from God that help us live in relationship with Him.', 
 'Easy', 
 ARRAY['virtues', 'theology', 'basics']),

('faith-basics', 'What is the first sacrament we receive?', 
 ARRAY['First Communion', 'Confirmation', 'Baptism', 'Reconciliation'], 
 2, 
 'Baptism is the first sacrament we receive, which cleanses us from original sin and makes us members of the Church.', 
 'Easy', 
 ARRAY['sacraments', 'baptism', 'basics']),

('faith-basics', 'How many sacraments are there in the Catholic Church?', 
 ARRAY['5', '6', '7', '8'], 
 2, 
 'There are 7 sacraments: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony.', 
 'Easy', 
 ARRAY['sacraments', 'basics', 'count']),

('faith-basics', 'What is the central mystery of our faith?', 
 ARRAY['The Holy Trinity', 'The Incarnation', 'The Resurrection', 'The Eucharist'], 
 0, 
 'The Holy Trinity - Father, Son, and Holy Spirit - is the central mystery of our faith and the source of all other mysteries.', 
 'Medium', 
 ARRAY['trinity', 'mystery', 'theology']),

('faith-basics', 'What does "Catholic" mean?', 
 ARRAY['Universal', 'Holy', 'Apostolic', 'One'], 
 0, 
 'Catholic means "universal" - the Church is for all people, in all places, at all times.', 
 'Easy', 
 ARRAY['catholic', 'meaning', 'basics']);

-- Insert sample questions for Bible Trivia category
INSERT INTO quiz_questions (category, question, options, correctAnswer, explanation, difficulty, tags) VALUES
('bible-trivia', 'How many days and nights did Jesus fast in the desert?', 
 ARRAY['30 days', '40 days', '50 days', '60 days'], 
 1, 
 'Jesus fasted for 40 days and 40 nights in the desert, just as Moses and Elijah did before Him.', 
 'Medium', 
 ARRAY['jesus', 'fasting', 'desert', 'bible']),

('bible-trivia', 'What was the name of Jesus'' mother?', 
 ARRAY['Mary', 'Elizabeth', 'Anna', 'Sarah'], 
 0, 
 'Jesus'' mother was Mary, who was chosen by God to be the Mother of Jesus and is honored as the Mother of God.', 
 'Easy', 
 ARRAY['mary', 'jesus', 'mother', 'bible']),

('bible-trivia', 'How many apostles did Jesus have?', 
 ARRAY['10', '11', '12', '13'], 
 2, 
 'Jesus had 12 apostles: Simon Peter, Andrew, James, John, Philip, Bartholomew, Thomas, Matthew, James, Thaddeus, Simon, and Judas Iscariot.', 
 'Easy', 
 ARRAY['apostles', 'jesus', 'twelve', 'bible']),

('bible-trivia', 'What was the first miracle Jesus performed?', 
 ARRAY['Walking on water', 'Feeding the 5000', 'Turning water into wine', 'Raising Lazarus'], 
 2, 
 'Jesus'' first miracle was turning water into wine at the wedding at Cana, showing His divine power and care for people.', 
 'Medium', 
 ARRAY['miracles', 'jesus', 'wine', 'cana', 'bible']),

('bible-trivia', 'Where was Jesus born?', 
 ARRAY['Nazareth', 'Bethlehem', 'Jerusalem', 'Jericho'], 
 1, 
 'Jesus was born in Bethlehem, fulfilling the prophecy that the Messiah would come from the city of David.', 
 'Easy', 
 ARRAY['jesus', 'birth', 'bethlehem', 'bible']);

-- Success message
SELECT 'Quiz tables fixed successfully with correct field names!' as status;

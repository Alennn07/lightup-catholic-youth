-- Universal Quiz Questions Seeding Script
-- This script works regardless of whether the column is 'correct_answer' or 'correctAnswer'

-- First, let's check what columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'quiz_questions' 
ORDER BY ordinal_position;

-- Clear existing questions to start fresh
DELETE FROM quiz_questions;

-- Insert questions using the correct column name based on what exists
-- We'll use a dynamic approach

-- Faith Basics Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
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
 'Medium', 
 ARRAY['sacraments', 'count', 'basics']),

('faith-basics', 'What is the central mystery of the Christian faith?', 
 ARRAY['The Resurrection', 'The Trinity', 'The Incarnation', 'The Eucharist'], 
 1, 
 'The Trinity - one God in three persons (Father, Son, and Holy Spirit) - is the central mystery of the Christian faith.', 
 'Medium', 
 ARRAY['trinity', 'mystery', 'theology']),

('faith-basics', 'What does "Catholic" mean?', 
 ARRAY['Roman', 'Universal', 'Traditional', 'Ancient'], 
 1, 
 'Catholic means "universal" - the Church is for all people, in all places, at all times.', 
 'Easy', 
 ARRAY['catholic', 'universal', 'basics']);

-- Bible Trivia Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
('bible-trivia', 'How many days and nights did Jesus fast in the desert?', 
 ARRAY['30 days', '40 days', '50 days', '60 days'], 
 1, 
 'Jesus fasted for 40 days and 40 nights in the desert, just as Moses and Elijah did before Him.', 
 'Easy', 
 ARRAY['jesus', 'fasting', 'desert']),

('bible-trivia', 'What was the name of Jesus'' mother?', 
 ARRAY['Mary', 'Elizabeth', 'Anna', 'Sarah'], 
 0, 
 'Jesus'' mother was Mary, who was chosen by God to be the Mother of Jesus and is honored as the Mother of God.', 
 'Easy', 
 ARRAY['mary', 'jesus', 'mother']),

('bible-trivia', 'How many books are in the New Testament?', 
 ARRAY['25', '26', '27', '28'], 
 2, 
 'There are 27 books in the New Testament: 4 Gospels, 1 Acts, 21 Letters, and 1 Revelation.', 
 'Medium', 
 ARRAY['new testament', 'books', 'bible']),

('bible-trivia', 'Who was the first Pope?', 
 ARRAY['Paul', 'Peter', 'John', 'James'], 
 1, 
 'Peter was the first Pope. Jesus gave him the keys to the kingdom and said "You are Peter, and on this rock I will build my church."', 
 'Medium', 
 ARRAY['peter', 'pope', 'church']),

('bible-trivia', 'What was the name of the garden where Adam and Eve lived?', 
 ARRAY['Eden', 'Paradise', 'Heaven', 'Garden of God'], 
 0, 
 'Adam and Eve lived in the Garden of Eden, which was a paradise where they walked with God.', 
 'Easy', 
 ARRAY['eden', 'adam', 'eve', 'garden']);

-- Church History Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
('church-history', 'In what year was the Catholic Church officially established?', 
 ARRAY['33 AD', '100 AD', '313 AD', '325 AD'], 
 0, 
 'The Catholic Church was officially established in 33 AD when Jesus gave Peter the keys to the kingdom and the Holy Spirit descended at Pentecost.', 
 'Medium', 
 ARRAY['church', 'history', 'establishment']),

('church-history', 'Which council defined the doctrine of the Trinity?', 
 ARRAY['Council of Nicaea', 'Council of Trent', 'Vatican I', 'Vatican II'], 
 0, 
 'The Council of Nicaea (325 AD) defined the doctrine of the Trinity and produced the Nicene Creed.', 
 'Hard', 
 ARRAY['council', 'trinity', 'nicaea']),

('church-history', 'Who was the first Christian martyr?', 
 ARRAY['Peter', 'Paul', 'Stephen', 'James'], 
 2, 
 'Stephen was the first Christian martyr, stoned to death for his faith as recorded in the Acts of the Apostles.', 
 'Medium', 
 ARRAY['stephen', 'martyr', 'acts']),

('church-history', 'Which Pope called the Second Vatican Council?', 
 ARRAY['Pope Pius XII', 'Pope John XXIII', 'Pope Paul VI', 'Pope John Paul II'], 
 1, 
 'Pope John XXIII called the Second Vatican Council (1962-1965) to renew the Church for the modern world.', 
 'Medium', 
 ARRAY['vatican ii', 'john xxiii', 'council']),

('church-history', 'What was the name of the period when the Church was persecuted in Rome?', 
 ARRAY['The Dark Ages', 'The Persecution Era', 'The Age of Martyrs', 'The Roman Persecution'], 
 2, 
 'The Age of Martyrs refers to the period when early Christians were persecuted by Roman emperors for their faith.', 
 'Medium', 
 ARRAY['martyrs', 'persecution', 'rome']);

-- Modern Faith Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
('modern-faith', 'What is the Catholic Church''s stance on social justice?', 
 ARRAY['It''s not important', 'It''s optional', 'It''s essential to the faith', 'It''s only for clergy'], 
 2, 
 'Social justice is essential to the Catholic faith. The Church teaches that we must work for the common good and care for the poor and vulnerable.', 
 'Medium', 
 ARRAY['social justice', 'modern', 'church teaching']),

('modern-faith', 'What does Pope Francis emphasize in his teachings?', 
 ARRAY['Traditional liturgy only', 'Mercy and compassion', 'Strict discipline', 'Political power'], 
 1, 
 'Pope Francis emphasizes mercy, compassion, and care for the poor and marginalized in his teachings.', 
 'Easy', 
 ARRAY['pope francis', 'mercy', 'compassion']),

('modern-faith', 'What is the Catholic Church''s view on environmental care?', 
 ARRAY['Not important', 'Optional', 'Essential part of faith', 'Only for scientists'], 
 2, 
 'The Catholic Church teaches that caring for creation is an essential part of our faith, as we are stewards of God''s creation.', 
 'Medium', 
 ARRAY['environment', 'creation', 'stewardship']),

('modern-faith', 'What does "synodality" mean in the modern Church?', 
 ARRAY['Walking together', 'Following the Pope', 'Traditional worship', 'Modern music'], 
 0, 
 'Synodality means "walking together" - the Church''s emphasis on listening to all members and making decisions together.', 
 'Hard', 
 ARRAY['synodality', 'modern', 'church']),

('modern-faith', 'What is the Catholic Church''s position on interfaith dialogue?', 
 ARRAY['Avoid other religions', 'Respect and dialogue', 'Convert everyone', 'Ignore other faiths'], 
 1, 
 'The Catholic Church promotes respectful dialogue with other religions while maintaining its own beliefs.', 
 'Medium', 
 ARRAY['interfaith', 'dialogue', 'modern']);

-- Saints and Heroes Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
('saints-heroes', 'Who is the patron saint of lost things?', 
 ARRAY['St. Anthony', 'St. Joseph', 'St. Michael', 'St. Francis'], 
 0, 
 'St. Anthony of Padua is the patron saint of lost things. Many people pray to him when they lose something.', 
 'Easy', 
 ARRAY['st anthony', 'patron saint', 'lost things']),

('saints-heroes', 'Which saint is known as the "Little Flower"?', 
 ARRAY['St. Teresa of Avila', 'St. Thérèse of Lisieux', 'St. Catherine of Siena', 'St. Clare'], 
 1, 
 'St. Thérèse of Lisieux is known as the "Little Flower" because of her "little way" of doing small things with great love.', 
 'Medium', 
 ARRAY['st therese', 'little flower', 'saints']),

('saints-heroes', 'Who founded the Franciscan order?', 
 ARRAY['St. Dominic', 'St. Francis of Assisi', 'St. Benedict', 'St. Ignatius'], 
 1, 
 'St. Francis of Assisi founded the Franciscan order, known for their poverty, simplicity, and love of nature.', 
 'Easy', 
 ARRAY['st francis', 'franciscan', 'founder']),

('saints-heroes', 'Which saint is the patron of students?', 
 ARRAY['St. Thomas Aquinas', 'St. Augustine', 'St. Jerome', 'St. Bonaventure'], 
 0, 
 'St. Thomas Aquinas is the patron saint of students and schools, known for his great theological works.', 
 'Medium', 
 ARRAY['st thomas aquinas', 'students', 'patron']),

('saints-heroes', 'Who was the first American-born saint?', 
 ARRAY['St. Elizabeth Ann Seton', 'St. Katharine Drexel', 'St. Frances Cabrini', 'St. John Neumann'], 
 0, 
 'St. Elizabeth Ann Seton was the first American-born saint, known for founding the first Catholic schools in America.', 
 'Hard', 
 ARRAY['st elizabeth ann seton', 'american', 'first saint']);

-- Prayer and Worship Questions
INSERT INTO quiz_questions (category, question, options, correct_answer, explanation, difficulty, tags) VALUES
('prayer-worship', 'What is the most important prayer in the Catholic Church?', 
 ARRAY['The Hail Mary', 'The Our Father', 'The Glory Be', 'The Act of Contrition'], 
 1, 
 'The Our Father (Lord''s Prayer) is the most important prayer, taught to us by Jesus Himself.', 
 'Easy', 
 ARRAY['our father', 'prayer', 'jesus']),

('prayer-worship', 'What are the four types of prayer?', 
 ARRAY['Praise, Thanks, Sorry, Please', 'Morning, Noon, Evening, Night', 'Silent, Loud, Fast, Slow', 'Personal, Group, Church, Home'], 
 0, 
 'The four types of prayer are Praise (adoration), Thanks (thanksgiving), Sorry (contrition), and Please (petition).', 
 'Medium', 
 ARRAY['prayer types', 'praise', 'thanks', 'sorry', 'please']),

('prayer-worship', 'What is the highest form of worship in the Catholic Church?', 
 ARRAY['Prayer', 'The Mass', 'Reading the Bible', 'Singing hymns'], 
 1, 
 'The Mass is the highest form of worship because it is the re-presentation of Christ''s sacrifice on the cross.', 
 'Medium', 
 ARRAY['mass', 'worship', 'eucharist']),

('prayer-worship', 'What does "Amen" mean?', 
 ARRAY['Thank you', 'So be it', 'Please', 'Goodbye'], 
 1, 
 'Amen means "So be it" or "I believe" - it''s our way of saying "Yes, I agree" to what we''ve prayed.', 
 'Easy', 
 ARRAY['amen', 'prayer', 'meaning']),

('prayer-worship', 'What is the Liturgy of the Hours?', 
 ARRAY['Daily Mass', 'Prayer throughout the day', 'Sunday worship', 'Confession'], 
 1, 
 'The Liturgy of the Hours is the official prayer of the Church, prayed at different times throughout the day.', 
 'Hard', 
 ARRAY['liturgy of the hours', 'prayer', 'daily']);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_difficulty ON quiz_questions(difficulty);

-- Show summary
SELECT 
    category,
    COUNT(*) as question_count,
    STRING_AGG(DISTINCT difficulty, ', ') as difficulties
FROM quiz_questions 
GROUP BY category 
ORDER BY category;

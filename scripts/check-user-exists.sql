-- Check if a specific user exists in the users table
-- Replace 'gotiyooo07@gmail.com' with the email you're trying to add

SELECT 
    id,
    email,
    name,
    username,
    created_at
FROM users 
WHERE email = 'gotiyooo07@gmail.com';

-- If no results, the user doesn't exist in the database
-- You need to either:
-- 1. Register the user first, or
-- 2. Use an email that exists in the users table

-- To see all users in the database:
-- SELECT id, email, name FROM users LIMIT 10;

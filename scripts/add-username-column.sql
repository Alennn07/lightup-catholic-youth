-- Add username column to users table
-- Run this in your Supabase SQL editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update existing users with a default username if they don't have one
UPDATE users 
SET username = 'user_' || id::text 
WHERE username IS NULL OR username = '';

-- Make username required for new users
ALTER TABLE users 
ALTER COLUMN username SET NOT NULL;

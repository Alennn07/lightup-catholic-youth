-- Script 1: Create Tables Only
-- Run this FIRST in Supabase SQL Editor

-- Create the Bible Verses table
CREATE TABLE IF NOT EXISTS bible_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT UNIQUE NOT NULL,
    verse_text TEXT NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    theme TEXT,
    reflection TEXT,
    action_prompt TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the Daily Verse Assignments table
CREATE TABLE IF NOT EXISTS daily_verse_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verse_id TEXT NOT NULL,
    assigned_date DATE UNIQUE NOT NULL,
    theme TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the User Verse Progress table
CREATE TABLE IF NOT EXISTS user_verse_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    verse_id TEXT NOT NULL,
    verse_date DATE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the Favorite Verses table
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    verse_id TEXT NOT NULL,
    verse_text TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success message
SELECT 'Tables created successfully!' as status;

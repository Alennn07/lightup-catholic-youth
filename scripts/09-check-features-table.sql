-- Check what's in the features table to debug routing
-- Run this in Supabase SQL Editor

-- Check all features
SELECT 
    id,
    name,
    description,
    category,
    user_count,
    rating
FROM features 
ORDER BY name;

-- Check specifically for Daily Bible Verse
SELECT 
    id,
    name,
    description,
    category
FROM features 
WHERE LOWER(name) LIKE '%bible%' 
   OR LOWER(name) LIKE '%verse%'
   OR LOWER(name) LIKE '%daily%';

-- Check for any features that might be causing confusion
SELECT 
    id,
    name,
    description,
    category
FROM features 
WHERE LOWER(name) LIKE '%faith%' 
   OR LOWER(name) LIKE '%ai%'
   OR LOWER(name) LIKE '%bot%';

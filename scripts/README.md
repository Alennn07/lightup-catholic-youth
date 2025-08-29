# Database Scripts Documentation

## 🎯 **Daily Bible Verse Feature**
- **`daily-bible-verse-complete-setup.sql`** - **MAIN SCRIPT** - Complete setup for Daily Bible Verse feature including tables, functions, and sample data

## 🏗️ **Core Database Setup**
- **`create-complete-database.sql`** - Complete database schema for the entire application
- **`create-database-schema.sql`** - Basic database structure and tables
- **`add-missing-columns.sql`** - Adds missing columns to existing tables
- **`add-username-column.sql`** - Adds username column to users table

## 👥 **Youth Groups Feature**
- **`create-youth-groups-database.sql`** - Complete youth groups database setup
- **`setup-youth-groups-simple.sql`** - Simplified youth groups setup

## 🗓️ **Events Feature**
- **`create-events-database.sql`** - Events database tables and structure

## 🙏 **Prayer Wall Feature**
- **`create-prayer-wall-database.sql`** - Prayer wall database setup

## 🧠 **Quiz Feature**
- **`create-quiz-database.sql** - Quiz database tables and structure

## 🔒 **Security & Policies**
- **`fix-rls-policies.sql`** - Row Level Security policies for all tables
- **`fix-rls-policies-v2.sql`** - Updated RLS policies (use this one)

## 🌱 **Sample Data**
- **`seed-production-data.sql`** - Production-ready sample data
- **`seed-sample-data.sql`** - Development sample data

## 🚀 **Quick Start**
To set up the Daily Bible Verse feature, run:
```sql
-- In Supabase SQL Editor
-- Copy and paste the content of daily-bible-verse-complete-setup.sql
```

## 📝 **Note**
All old development scripts have been cleaned up. Only production-ready scripts remain.

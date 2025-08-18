-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS prayer_intentions CASCADE;
DROP TABLE IF EXISTS group_memberships CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS youth_groups CASCADE;
DROP TABLE IF EXISTS bible_verses CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS feature_feedback CASCADE;
DROP TABLE IF EXISTS app_analytics CASCADE;

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  parish TEXT NOT NULL,
  diocese TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  interests TEXT[],
  spiritual_gifts TEXT[],
  ministry_roles TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create youth_groups table
CREATE TABLE youth_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parish TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  age_range TEXT NOT NULL,
  meeting_day TEXT NOT NULL,
  meeting_time TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  website_url TEXT,
  social_media JSONB DEFAULT '{}',
  type TEXT[] NOT NULL,
  activities TEXT[],
  requirements TEXT[],
  members_count INTEGER DEFAULT 0,
  max_capacity INTEGER,
  is_active BOOLEAN DEFAULT true,
  registration_open BOOLEAN DEFAULT true,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayer_requests table
CREATE TABLE prayer_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  request TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Health', 'Family', 'Education', 'Work', 'Spiritual', 'Relationships', 'Financial', 'Other')),
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  prayer_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'closed')),
  answered_description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES youth_groups(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('youth-mass', 'service', 'social', 'prayer', 'education', 'retreat', 'pilgrimage', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  city TEXT,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT FALSE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2) DEFAULT 0.00,
  organizer TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  requirements TEXT[],
  what_to_bring TEXT[],
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('joyful', 'peaceful', 'grateful', 'hopeful', 'contemplative', 'struggling', 'anxious', 'sad', 'excited', 'blessed')),
  spiritual_insights TEXT,
  prayer_requests TEXT,
  gratitude_list TEXT[],
  scripture_references TEXT[],
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT TRUE,
  date DATE NOT NULL,
  weather TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bible_verses table
CREATE TABLE bible_verses (
  id SERIAL PRIMARY KEY,
  verse TEXT NOT NULL,
  reference TEXT NOT NULL,
  translation TEXT DEFAULT 'NIV',
  reflection TEXT NOT NULL,
  author TEXT DEFAULT 'LightUp Team',
  theme TEXT,
  season TEXT, -- liturgical season
  date DATE NOT NULL UNIQUE,
  image_url TEXT,
  audio_url TEXT,
  related_verses TEXT[],
  discussion_questions TEXT[],
  prayer_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_memberships table
CREATE TABLE group_memberships (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  group_id INTEGER REFERENCES youth_groups(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'left')),
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'leader', 'coordinator', 'admin')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  UNIQUE(user_id, group_id)
);

-- Create event_attendees table
CREATE TABLE event_attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  dietary_requirements TEXT,
  emergency_contact TEXT,
  UNIQUE(event_id, user_id)
);

-- Create prayer_intentions table
CREATE TABLE prayer_intentions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  prayer_request_id INTEGER REFERENCES prayer_requests(id) ON DELETE CASCADE,
  prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prayer_type TEXT DEFAULT 'general' CHECK (prayer_type IN ('general', 'rosary', 'novena', 'mass_intention', 'personal')),
  duration_minutes INTEGER,
  notes TEXT,
  UNIQUE(user_id, prayer_request_id, DATE(prayed_at))
);

-- Create notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('prayer_request', 'event', 'group', 'system', 'reminder')),
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature_feedback table
CREATE TABLE feature_feedback (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  feature_id TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'compliment', 'question')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'in_progress', 'resolved', 'rejected')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_analytics table
CREATE TABLE app_analytics (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_path TEXT,
  feature_used TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE youth_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_analytics ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Prayer requests policies
CREATE POLICY "Prayer requests are viewable by everyone" ON prayer_requests FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own prayer requests" ON prayer_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prayer requests" ON prayer_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own prayer requests" ON prayer_requests FOR DELETE USING (auth.uid() = user_id);

-- Youth groups policies
CREATE POLICY "Youth groups are viewable by everyone" ON youth_groups FOR SELECT USING (is_active = true);
CREATE POLICY "Group creators can update their groups" ON youth_groups FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create groups" ON youth_groups FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Journal entries policies (private)
CREATE POLICY "Users can view own journal entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal entries" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Bible verses policies (public read)
CREATE POLICY "Bible verses are viewable by everyone" ON bible_verses FOR SELECT USING (true);

-- Group memberships policies
CREATE POLICY "Group memberships are viewable by members and group creators" ON group_memberships 
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT created_by FROM youth_groups WHERE id = group_id)
);
CREATE POLICY "Users can request to join groups" ON group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own membership status" ON group_memberships FOR UPDATE USING (auth.uid() = user_id);

-- Event attendees policies
CREATE POLICY "Event attendees viewable by attendees and organizers" ON event_attendees 
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM events WHERE id = event_id)
);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON event_attendees FOR UPDATE USING (auth.uid() = user_id);

-- Prayer intentions policies
CREATE POLICY "Users can view prayer intentions" ON prayer_intentions FOR SELECT USING (true);
CREATE POLICY "Users can insert own prayer intentions" ON prayer_intentions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Feature feedback policies
CREATE POLICY "Users can view own feedback" ON feature_feedback FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can submit feedback" ON feature_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own feedback" ON feature_feedback FOR UPDATE USING (auth.uid() = user_id);

-- App analytics policies (admin only for viewing)
CREATE POLICY "Users can insert analytics" ON app_analytics FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_parish ON user_profiles(parish);
CREATE INDEX idx_user_profiles_city ON user_profiles(city);
CREATE INDEX idx_user_profiles_active ON user_profiles(is_active);

CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at DESC);
CREATE INDEX idx_prayer_requests_category ON prayer_requests(category);
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX idx_prayer_requests_public ON prayer_requests(is_public);

CREATE INDEX idx_youth_groups_city ON youth_groups(city);
CREATE INDEX idx_youth_groups_active ON youth_groups(is_active);
CREATE INDEX idx_youth_groups_type ON youth_groups USING GIN(type);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_group_id ON events(group_id);

CREATE INDEX idx_journal_entries_user_date ON journal_entries(user_id, date DESC);
CREATE INDEX idx_journal_entries_mood ON journal_entries(mood);
CREATE INDEX idx_journal_entries_tags ON journal_entries USING GIN(tags);

CREATE INDEX idx_bible_verses_date ON bible_verses(date);
CREATE INDEX idx_bible_verses_theme ON bible_verses(theme);
CREATE INDEX idx_bible_verses_season ON bible_verses(season);

CREATE INDEX idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX idx_group_memberships_status ON group_memberships(status);

CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_feature_feedback_feature_id ON feature_feedback(feature_id);
CREATE INDEX idx_feature_feedback_status ON feature_feedback(status);

CREATE INDEX idx_analytics_event_type ON app_analytics(event_type);
CREATE INDEX idx_analytics_created_at ON app_analytics(created_at DESC);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_youth_groups_updated_at BEFORE UPDATE ON youth_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_feedback_updated_at BEFORE UPDATE ON feature_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE youth_groups 
        SET members_count = members_count + 1 
        WHERE id = NEW.group_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE youth_groups 
            SET members_count = members_count + 1 
            WHERE id = NEW.group_id;
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE youth_groups 
            SET members_count = members_count - 1 
            WHERE id = NEW.group_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
        UPDATE youth_groups 
        SET members_count = members_count - 1 
        WHERE id = OLD.group_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_group_member_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON group_memberships
    FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Create function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
        UPDATE events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'registered' AND NEW.status = 'registered' THEN
            UPDATE events 
            SET current_attendees = current_attendees + 1 
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'registered' AND NEW.status != 'registered' THEN
            UPDATE events 
            SET current_attendees = current_attendees - 1 
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
        UPDATE events 
        SET current_attendees = current_attendees - 1 
        WHERE id = OLD.event_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_attendee_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON event_attendees
    FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

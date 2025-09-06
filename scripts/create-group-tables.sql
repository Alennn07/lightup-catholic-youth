-- Create group_events table
CREATE TABLE IF NOT EXISTS group_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255),
  max_attendees INTEGER,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_posts table
CREATE TABLE IF NOT EXISTS group_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES youth_groups(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'announcement' CHECK (type IN ('announcement', 'discussion', 'prayer_request', 'event_reminder')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_events_group_id ON group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_group_events_event_date ON group_events(event_date);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_created_at ON group_posts(created_at);

-- Enable RLS
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_events
CREATE POLICY "Group members can view events" ON group_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_events.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Group owners can create events" ON group_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_events.group_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Group owners can update events" ON group_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_events.group_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Group owners can delete events" ON group_events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_events.group_id 
      AND owner_id = auth.uid()
    )
  );

-- RLS Policies for group_posts
CREATE POLICY "Group members can view posts" ON group_posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Group members can create posts" ON group_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_id = group_posts.group_id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Post creators can update their posts" ON group_posts
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Group owners can delete any post" ON group_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM youth_groups 
      WHERE id = group_posts.group_id 
      AND owner_id = auth.uid()
    )
  );

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_group_events_updated_at BEFORE UPDATE ON group_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_posts_updated_at BEFORE UPDATE ON group_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

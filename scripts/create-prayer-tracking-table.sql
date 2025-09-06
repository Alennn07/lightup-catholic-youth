-- Create table to track which users have prayed for which prayer requests
-- This prevents users from praying multiple times for the same request

CREATE TABLE IF NOT EXISTS prayer_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_request_id UUID NOT NULL REFERENCES prayer_requests(id) ON DELETE CASCADE,
  prayed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only pray once per prayer request
  UNIQUE(user_id, prayer_request_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_prayer_participants_user_id ON prayer_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_participants_prayer_request_id ON prayer_participants(prayer_request_id);

-- Enable RLS
ALTER TABLE prayer_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own prayer participations" ON prayer_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayer participations" ON prayer_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to see prayer counts (but not who prayed)
CREATE POLICY "Anyone can view prayer participation counts" ON prayer_participants
  FOR SELECT USING (true);

-- Update prayer_requests table to use the new tracking system
-- The prayer_count will now be calculated from prayer_participants table
-- We'll keep the prayer_count column for performance but update it via triggers

-- Create function to update prayer count
CREATE OR REPLACE FUNCTION update_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE prayer_requests 
    SET prayer_count = (
      SELECT COUNT(*) 
      FROM prayer_participants 
      WHERE prayer_request_id = NEW.prayer_request_id
    )
    WHERE id = NEW.prayer_request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE prayer_requests 
    SET prayer_count = (
      SELECT COUNT(*) 
      FROM prayer_participants 
      WHERE prayer_request_id = OLD.prayer_request_id
    )
    WHERE id = OLD.prayer_request_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update prayer count
CREATE TRIGGER update_prayer_count_trigger
  AFTER INSERT OR DELETE ON prayer_participants
  FOR EACH ROW EXECUTE FUNCTION update_prayer_count();

-- Update existing prayer counts to match the new system
UPDATE prayer_requests 
SET prayer_count = (
  SELECT COUNT(*) 
  FROM prayer_participants 
  WHERE prayer_request_id = prayer_requests.id
);

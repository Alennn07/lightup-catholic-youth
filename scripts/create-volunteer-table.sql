-- Create volunteer_applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL,
  experience VARCHAR(50),
  availability VARCHAR(50) NOT NULL,
  motivation TEXT NOT NULL,
  skills TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON volunteer_applications(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for form submissions)
CREATE POLICY "Allow public insert for volunteer applications" ON volunteer_applications
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read (for admin)
CREATE POLICY "Allow authenticated users to read volunteer applications" ON volunteer_applications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update (for admin)
CREATE POLICY "Allow authenticated users to update volunteer applications" ON volunteer_applications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_volunteer_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_volunteer_applications_updated_at
  BEFORE UPDATE ON volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_volunteer_applications_updated_at();

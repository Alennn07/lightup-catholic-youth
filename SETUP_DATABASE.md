# Database Setup for Volunteer Applications

## Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor

## Step 2: Run the SQL Script
Copy and paste the following SQL script into the SQL Editor and run it:

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_email ON volunteer_applications(email);
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON volunteer_applications(status);
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
```

## Step 3: Test the Setup
1. Go to your About page and submit a volunteer application
2. Go to `/admin/volunteer-requests` and enter password: `lightup2024`
3. You should see the application appear in the admin panel

## Troubleshooting
- If you get permission errors, make sure RLS policies are set up correctly
- Check the Supabase logs for any SQL errors
- Ensure your Supabase project has the correct environment variables in your `.env.local` file

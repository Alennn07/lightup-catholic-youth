-- Create security logs table for tracking authentication and security events
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);

-- Enable RLS
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for security_logs
-- Only admins can view security logs
CREATE POLICY "Admins can view all security logs" ON security_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- System can insert security logs (for API routes)
CREATE POLICY "System can insert security logs" ON security_logs
    FOR INSERT
    WITH CHECK (true);

-- No updates or deletes allowed on security logs
CREATE POLICY "No updates allowed on security logs" ON security_logs
    FOR UPDATE
    USING (false);

CREATE POLICY "No deletes allowed on security logs" ON security_logs
    FOR DELETE
    USING (false);

-- Add comment
COMMENT ON TABLE security_logs IS 'Security event logs for authentication, rate limiting, and security monitoring';
COMMENT ON COLUMN security_logs.event_type IS 'Type of security event (login_success, login_failed, rate_limited, etc.)';
COMMENT ON COLUMN security_logs.details IS 'Additional event details in JSON format';
COMMENT ON COLUMN security_logs.ip_address IS 'IP address of the client';
COMMENT ON COLUMN security_logs.user_agent IS 'User agent string from the client';

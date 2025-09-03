-- Create error logs table for tracking client-side and server-side errors
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_id VARCHAR(100) UNIQUE,
    message TEXT NOT NULL,
    stack TEXT,
    component_stack TEXT,
    user_agent TEXT,
    url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    environment VARCHAR(20) DEFAULT 'development',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    additional_data JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_error_logs_error_id ON error_logs(error_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_environment ON error_logs(environment);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for error_logs
-- Only admins can view error logs
CREATE POLICY "Admins can view all error logs" ON error_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- System can insert error logs (for API routes)
CREATE POLICY "System can insert error logs" ON error_logs
    FOR INSERT
    WITH CHECK (true);

-- Admins can update error logs (mark as resolved)
CREATE POLICY "Admins can update error logs" ON error_logs
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- No deletes allowed on error logs (for audit trail)
CREATE POLICY "No deletes allowed on error logs" ON error_logs
    FOR DELETE
    USING (false);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_error_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_error_logs_updated_at
    BEFORE UPDATE ON error_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_error_logs_updated_at();

-- Add comment
COMMENT ON TABLE error_logs IS 'Error logs for tracking client-side and server-side errors';
COMMENT ON COLUMN error_logs.error_id IS 'Unique identifier for the error instance';
COMMENT ON COLUMN error_logs.message IS 'Error message';
COMMENT ON COLUMN error_logs.stack IS 'JavaScript stack trace';
COMMENT ON COLUMN error_logs.component_stack IS 'React component stack trace';
COMMENT ON COLUMN error_logs.severity IS 'Error severity level (low, medium, high, critical)';
COMMENT ON COLUMN error_logs.environment IS 'Environment where error occurred (development, production)';
COMMENT ON COLUMN error_logs.user_id IS 'User ID associated with the error (if known)';
COMMENT ON COLUMN error_logs.additional_data IS 'Additional context data in JSON format';
COMMENT ON COLUMN error_logs.resolved IS 'Whether the error has been resolved';

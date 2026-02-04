-- Migration: Create resumes table
-- Date: 2026-02-04
-- Description: Initial table for storing uploaded resumes

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    mime_type TEXT,
    parse_status TEXT DEFAULT 'PENDING' CHECK (parse_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    parsed_data JSONB, -- Structured data extracted by AI
    parse_error TEXT, -- Error message if parsing fails
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see and manage their own resumes
CREATE POLICY "Users can manage their own resumes" 
ON public.resumes
FOR ALL 
USING (auth.uid() = user_id);

-- Index for faster lookups by user
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);

-- Index for status filtering
CREATE INDEX idx_resumes_parse_status ON public.resumes(parse_status);

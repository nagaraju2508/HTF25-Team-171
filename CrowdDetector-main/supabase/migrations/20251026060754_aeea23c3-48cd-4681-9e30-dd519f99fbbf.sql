-- Update RLS policies to allow public access (no authentication required)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own analysis" ON public.video_analysis;
DROP POLICY IF EXISTS "Users can insert their own analysis" ON public.video_analysis;

-- Create public policies
CREATE POLICY "Anyone can view analysis"
ON public.video_analysis
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert analysis"
ON public.video_analysis
FOR INSERT
WITH CHECK (true);

-- Update user_id column to be nullable since we're removing auth
ALTER TABLE public.video_analysis ALTER COLUMN user_id DROP NOT NULL;
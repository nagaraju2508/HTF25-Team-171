-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crowd-videos',
  'crowd-videos',
  false,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo']
);

-- Storage policies for authenticated users
CREATE POLICY "Users can upload their own videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'crowd-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'crowd-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'crowd-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for analysis results
CREATE TABLE public.video_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  video_url TEXT,
  file_path TEXT,
  total_people INTEGER NOT NULL DEFAULT 0,
  crowd_level TEXT NOT NULL,
  average_density FLOAT NOT NULL DEFAULT 0,
  safe_zones INTEGER NOT NULL DEFAULT 0,
  warning_zones INTEGER NOT NULL DEFAULT 0,
  danger_zones INTEGER NOT NULL DEFAULT 0,
  alerts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_analysis ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_analysis
CREATE POLICY "Users can view their own analysis"
ON public.video_analysis
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis"
ON public.video_analysis
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_analysis_updated_at
BEFORE UPDATE ON public.video_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
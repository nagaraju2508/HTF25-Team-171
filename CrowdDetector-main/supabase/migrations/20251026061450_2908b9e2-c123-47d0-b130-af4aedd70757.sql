-- Enable realtime for video_analysis table
ALTER TABLE public.video_analysis REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_analysis;
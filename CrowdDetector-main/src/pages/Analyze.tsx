import { useState } from "react";
import { Upload, Video, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Analyze = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }
    
    await analyzeVideo(file);
  };

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(10);
    setResults(null);

    try {
      setProgress(20);
      
      // Upload video to storage
      const fileName = `public/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('crowd-videos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload video');
      }

      setProgress(40);

      // Call edge function to analyze
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-video', {
        body: { videoPath: fileName }
      });

      setProgress(80);

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(analysisError.message || 'Failed to analyze video');
      }

      setProgress(100);
      setResults(analysisData);
      toast.success("Video analysis complete!");

    } catch (error: any) {
      console.error('Error analyzing video:', error);
      toast.error(error.message || "Failed to analyze video. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }

    setIsAnalyzing(true);
    setProgress(10);
    setResults(null);

    try {
      setProgress(30);

      // Call edge function to analyze URL
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-video', {
        body: { videoUrl }
      });

      setProgress(80);

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error(analysisError.message || 'Failed to analyze video');
      }

      setProgress(100);
      setResults(analysisData);
      toast.success("Video analysis complete!");

    } catch (error: any) {
      console.error('Error analyzing video:', error);
      toast.error(error.message || "Failed to analyze video. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Analyze <span className="gradient-text">Crowd Videos</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Upload a video or paste a URL to analyze crowd density and safety metrics
          </p>
          
          {/* Upload Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass p-8 border-dashed border-2 border-primary/30 hover:border-primary/60 transition-all cursor-pointer group">
              <label htmlFor="video-upload" className="cursor-pointer block text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Video File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports MP4, AVI, MOV formats
                </p>
                <Button variant="hero" size="sm">
                  Choose File
                </Button>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isAnalyzing}
                />
              </label>
            </Card>
            
            <Card className="glass p-8">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Video URL</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Paste a YouTube or direct video link
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
                <Button onClick={handleUrlSubmit} disabled={isAnalyzing}>
                  Analyze
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="glass p-8 mb-8 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Analyzing Video...</h3>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {progress < 50 ? "Detecting people..." : progress < 80 ? "Calculating density..." : "Generating heatmap..."}
              </p>
            </Card>
          )}
          
          {/* Results */}
          {results && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in">
              <Card className="glass p-8">
                <h3 className="text-2xl font-bold mb-6">Analysis Results</h3>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">{results.totalPeople}</div>
                    <div className="text-sm text-muted-foreground">Total People Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-500 mb-2">{results.crowdLevel}</div>
                    <div className="text-sm text-muted-foreground">Crowd Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {(results.averageDensity * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Average Density</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="glass p-4 rounded-lg border border-green-500/30">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{results.safeZones}</div>
                    <div className="text-sm text-muted-foreground">Safe Zones</div>
                  </div>
                  <div className="glass p-4 rounded-lg border border-yellow-500/30">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold">{results.warningZones}</div>
                    <div className="text-sm text-muted-foreground">Warning Zones</div>
                  </div>
                  <div className="glass p-4 rounded-lg border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-500 mb-2" />
                    <div className="text-2xl font-bold">{results.dangerZones}</div>
                    <div className="text-sm text-muted-foreground">Danger Zones</div>
                  </div>
                </div>
              </Card>
              
              <Card className="glass p-8">
                <h3 className="text-xl font-bold mb-4">Alert Timeline</h3>
                <div className="space-y-4">
                  {results.alerts.map((alert: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        alert.level === "danger"
                          ? "border-red-500/30 bg-red-500/5"
                          : alert.level === "warning"
                          ? "border-yellow-500/30 bg-yellow-500/5"
                          : "border-blue-500/30 bg-blue-500/5"
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 mt-0.5 ${
                          alert.level === "danger"
                            ? "text-red-500"
                            : alert.level === "warning"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="font-mono text-sm text-muted-foreground mb-1">{alert.time}</div>
                        <div>{alert.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="flex gap-4">
                <Button variant="hero" className="flex-1">
                  Download Report (PDF)
                </Button>
                <Button variant="glass" onClick={() => setResults(null)}>
                  Analyze Another Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;

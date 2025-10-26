import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, AlertTriangle, TrendingUp, Activity, Video, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('video_analysis_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_analysis'
        },
        (payload) => {
          console.log('New analysis added:', payload);
          // Refetch all analyses when a new one is added
          fetchAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error: any) {
      console.error('Error fetching analyses:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate stats
  const totalPeople = analyses.reduce((sum, a) => sum + a.total_people, 0);
  const avgDensity = analyses.length > 0 
    ? analyses.reduce((sum, a) => sum + a.average_density, 0) / analyses.length 
    : 0;
  const totalSafeZones = analyses.reduce((sum, a) => sum + a.safe_zones, 0);
  const totalWarningZones = analyses.reduce((sum, a) => sum + a.warning_zones, 0);
  const totalDangerZones = analyses.reduce((sum, a) => sum + a.danger_zones, 0);
  
  const criticalCount = analyses.filter(a => a.crowd_level === 'Critical').length;
  const overallStatus = criticalCount > analyses.length / 2 ? 'Critical' : 
                        criticalCount > 0 ? 'Warning' : 'Safe';

  // Prepare chart data from analyses
  const densityData = analyses.slice(0, 9).reverse().map((analysis, index) => ({
    time: new Date(analysis.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    density: analysis.average_density,
  }));

  // Collect all alerts from recent analyses
  const allAlerts = analyses.slice(0, 5).flatMap((analysis, analysisIndex) => 
    (analysis.alerts || []).map((alert: any, alertIndex: number) => ({
      id: `${analysisIndex}-${alertIndex}`,
      time: new Date(analysis.created_at).toLocaleString(),
      zone: `Analysis ${analysisIndex + 1}`,
      level: alert.level === 'danger' ? 'Critical' : alert.level === 'warning' ? 'High' : 'Medium',
      status: 'Resolved',
      message: alert.message,
    }))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-4">
          Analytics <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Real-time crowd intelligence and safety metrics from video analyses
        </p>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalPeople}</div>
            <div className="text-sm text-muted-foreground">Total People Analyzed</div>
          </Card>
          
          <Card className="glass p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-secondary" />
              </div>
              <div className={`text-xs font-semibold ${
                avgDensity > 0.7 ? 'text-red-500' : avgDensity > 0.4 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {avgDensity > 0.7 ? 'CRITICAL' : avgDensity > 0.4 ? 'WARNING' : 'SAFE'}
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{(avgDensity * 100).toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Average Crowd Density</div>
          </Card>
          
          <Card className="glass p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            <div className="text-3xl font-bold mb-1">{analyses.length}</div>
            <div className="text-sm text-muted-foreground">Total Analyses</div>
          </Card>
          
          <Card className="glass p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                overallStatus === 'Critical' ? 'bg-red-500/20' : 
                overallStatus === 'Warning' ? 'bg-yellow-500/20' : 'bg-green-500/20'
              }`}>
                <Activity className={`w-6 h-6 ${
                  overallStatus === 'Critical' ? 'text-red-500' : 
                  overallStatus === 'Warning' ? 'text-yellow-500' : 'text-green-500'
                }`} />
              </div>
              <div className={`text-xs font-semibold ${
                overallStatus === 'Critical' ? 'text-red-500' : 
                overallStatus === 'Warning' ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {overallStatus.toUpperCase()}
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{overallStatus}</div>
            <div className="text-sm text-muted-foreground">Overall Status</div>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-6">Crowd Density Over Time</h3>
            {densityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={densityData}>
                  <defs>
                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(263, 70%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 15%)" />
                  <XAxis dataKey="time" stroke="hsl(240, 5%, 65%)" />
                  <YAxis stroke="hsl(240, 5%, 65%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(240, 10%, 5%)", 
                      border: "1px solid hsl(240, 10%, 15%)",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="density" 
                    stroke="hsl(263, 70%, 50%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDensity)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No analysis data available yet
              </div>
            )}
          </Card>
          
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-6">Zone Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Safe Zones</span>
                  <span className="text-sm text-muted-foreground">{totalSafeZones}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${Math.min((totalSafeZones / (totalSafeZones + totalWarningZones + totalDangerZones)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Warning Zones</span>
                  <span className="text-sm text-muted-foreground">{totalWarningZones}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${Math.min((totalWarningZones / (totalSafeZones + totalWarningZones + totalDangerZones)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Danger Zones</span>
                  <span className="text-sm text-muted-foreground">{totalDangerZones}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${Math.min((totalDangerZones / (totalSafeZones + totalWarningZones + totalDangerZones)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Recent Video Analyses */}
        <Card className="glass p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Recent Video Analyses</h3>
          {analyses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="glass p-4 hover:border-primary/50 transition-all">
                  {/* Video Preview */}
                  {analysis.video_url && (
                    <div className="relative mb-4 rounded-lg overflow-hidden bg-black aspect-video">
                      {analysis.video_url.includes('youtube.com') || analysis.video_url.includes('youtu.be') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${
                            analysis.video_url.includes('youtu.be') 
                              ? analysis.video_url.split('/').pop()
                              : new URLSearchParams(new URL(analysis.video_url).search).get('v')
                          }`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Video className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Analysis Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        analysis.crowd_level === 'Critical' ? 'bg-red-500/20 text-red-500' :
                        analysis.crowd_level === 'Warning' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {analysis.crowd_level}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">People</div>
                        <div className="font-bold text-lg">{analysis.total_people}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Density</div>
                        <div className="font-bold text-lg">{(analysis.average_density * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 rounded bg-green-500/10">
                        <div className="font-bold text-green-500">{analysis.safe_zones}</div>
                        <div className="text-muted-foreground">Safe</div>
                      </div>
                      <div className="text-center p-2 rounded bg-yellow-500/10">
                        <div className="font-bold text-yellow-500">{analysis.warning_zones}</div>
                        <div className="text-muted-foreground">Warning</div>
                      </div>
                      <div className="text-center p-2 rounded bg-red-500/10">
                        <div className="font-bold text-red-500">{analysis.danger_zones}</div>
                        <div className="text-muted-foreground">Danger</div>
                      </div>
                    </div>
                    
                    {analysis.video_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2"
                        onClick={() => window.open(analysis.video_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Original
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No analyses yet. Upload or analyze a video to see results here.
            </div>
          )}
        </Card>

        {/* Alert History Table */}
        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-6">Recent Alerts</h3>
          {allAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-semibold">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold">Source</th>
                    <th className="text-left py-3 px-4 font-semibold">Level</th>
                    <th className="text-left py-3 px-4 font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {allAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{alert.time}</td>
                      <td className="py-3 px-4">{alert.zone}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          alert.level === "Critical" 
                            ? "bg-red-500/20 text-red-500" 
                            : alert.level === "High"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-blue-500/20 text-blue-500"
                        }`}>
                          {alert.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{alert.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No alerts yet. Analyze some videos to see data here.
            </div>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

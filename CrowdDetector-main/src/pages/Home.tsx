import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Video, BarChart3, AlertTriangle, Upload, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6 animate-glow">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">AI-Powered Crowd Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI That Keeps
            <br />
            <span className="gradient-text">Crowds Safe</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Real-time crowd density analysis and safety monitoring using advanced AI technology.
            Prevent overcrowding before it becomes dangerous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/analyze">
              <Button variant="hero" size="lg" className="gap-2">
                <Upload className="w-5 h-5" />
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="glass" size="lg" className="gap-2">
                <Shield className="w-5 h-5" />
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Intelligent <span className="gradient-text">Safety Features</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Powered by state-of-the-art AI models to provide comprehensive crowd analysis
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Detection</h3>
              <p className="text-muted-foreground">
                Analyze video feeds in real-time with advanced people detection and counting algorithms.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl hover:border-secondary/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Visualize crowd density with heatmaps and get insights through interactive dashboards.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl hover:border-destructive/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Alerts</h3>
              <p className="text-muted-foreground">
                Get immediate notifications when crowd density exceeds safe thresholds.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass p-12 rounded-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">99.5%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">30fps</div>
                <div className="text-muted-foreground">Processing Speed</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">1000+</div>
                <div className="text-muted-foreground">Events Monitored</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-muted-foreground">Real-Time Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;

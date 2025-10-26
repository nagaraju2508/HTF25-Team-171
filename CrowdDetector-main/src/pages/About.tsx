import { Shield, Target, Zap, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            About <span className="gradient-text">CrowdSafe AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Using artificial intelligence to make large events safer for everyone
          </p>
          
          <Card className="glass p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              CrowdSafe AI was developed to address the critical challenge of crowd management at large-scale events. 
              By leveraging state-of-the-art computer vision and machine learning technologies, we provide event 
              organizers, security teams, and venue managers with real-time insights into crowd dynamics, enabling 
              them to make informed decisions that prioritize public safety.
            </p>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="glass p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Detection</h3>
              <p className="text-muted-foreground">
                Our AI models are trained on diverse datasets to accurately detect and count people in various 
                environments and lighting conditions with 99.5% accuracy.
              </p>
            </Card>
            
            <Card className="glass p-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Processing</h3>
              <p className="text-muted-foreground">
                Process video feeds at 30 frames per second, providing instant alerts and insights when crowd 
                density reaches concerning levels.
              </p>
            </Card>
            
            <Card className="glass p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Crowd Analytics</h3>
              <p className="text-muted-foreground">
                Generate detailed reports and visualizations showing crowd flow patterns, density heatmaps, 
                and risk assessments for better event planning.
              </p>
            </Card>
            
            <Card className="glass p-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Our technology focuses on crowd density analysis without facial recognition or personal 
                identification, respecting individual privacy.
              </p>
            </Card>
          </div>
          
          <Card className="glass p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI & Machine Learning</h3>
                <ul className="space-y-1">
                  <li>• YOLOv8 for object detection</li>
                  <li>• OpenCV for image processing</li>
                  <li>• Custom CNN for crowd counting</li>
                  <li>• TensorFlow/PyTorch backend</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Web Technologies</h3>
                <ul className="space-y-1">
                  <li>• React.js + TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Recharts for visualizations</li>
                  <li>• FastAPI backend</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Card className="glass p-8 border-primary/30">
            <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🎪 Concerts & Festivals</h3>
                <p className="text-muted-foreground">
                  Monitor crowd density at music festivals and outdoor events to prevent overcrowding near stages and exits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🏟️ Sports Venues</h3>
                <p className="text-muted-foreground">
                  Track crowd movement in stadiums to optimize entry/exit flows and identify potential bottlenecks.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🏢 Public Spaces</h3>
                <p className="text-muted-foreground">
                  Analyze foot traffic in malls, airports, and transit stations to improve crowd management strategies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎉 Special Events</h3>
                <p className="text-muted-foreground">
                  Ensure safety at parades, protests, and gatherings by providing real-time crowd intelligence.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

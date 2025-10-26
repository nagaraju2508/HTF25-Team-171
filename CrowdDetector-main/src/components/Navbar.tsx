import { Link, useLocation } from "react-router-dom";
import { Shield, Home, Upload, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/analyze", label: "Analyze", icon: Upload },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
          <span className="text-xl font-bold gradient-text">CrowdSafe AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="icon"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

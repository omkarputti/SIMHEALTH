import { Button } from "@/components/ui/button";
import { Heart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Heart className="h-6 w-6 text-primary-foreground animate-heartbeat" />
            </div>
            <span className="text-xl font-bold text-gradient">SIMHEALTH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/research" className="text-foreground hover:text-primary transition-colors relative group">
              Research
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors relative group">
              Contact Info
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/help" className="text-foreground hover:text-primary transition-colors relative group">
              Help
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/login">
              <Button className="btn-hover-glow hover:scale-105 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/research" 
                className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Research
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Contact Info
              </Link>
              <Link 
                to="/help" 
                className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                Help
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full btn-hover-glow">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
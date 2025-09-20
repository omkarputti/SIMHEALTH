import { Heart, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SIMHEALTH</span>
            </div>
            <p className="text-background/80 mb-4">
              Democratizing healthcare through AI-powered multimodal disease prediction and clinical-grade reporting.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-background/80">contact@simhealth.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-background/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-background/80">IIT Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team</h3>
            <div className="space-y-2">
              <p className="text-background/80">Dr. Rajesh Kumar</p>
              <p className="text-background/80">Priya Sharma</p>
              <p className="text-background/80">Arjun Patel</p>
              <p className="text-background/80">Sneha Gupta</p>
            </div>
          </div>

          {/* Demo & Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Youtube className="h-4 w-4" />
                <a href="#" className="text-background/80 hover:text-background transition-colors">
                  Demo Video
                </a>
              </div>
              <Link to="/research" className="block text-background/80 hover:text-background transition-colors">
                Research Papers
              </Link>
              <Link to="/digital-twin" className="block text-background/80 hover:text-background transition-colors">
                Digital Twin Demo
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">
            © 2024 SIMHEALTH. All rights reserved. Built for democratizing healthcare access.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
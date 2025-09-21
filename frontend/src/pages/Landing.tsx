import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Upload, Brain, FileText, Heart, Stethoscope, Shield, Users, Award, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-hero px-4 py-24 text-center animate-fade-in relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="animate-float mb-8">
            <div className="relative inline-block">
              <Heart className="mx-auto h-20 w-20 text-primary mb-4 animate-pulse-glow" />
              <div className="absolute inset-0 animate-ping">
                <Heart className="mx-auto h-20 w-20 text-primary/20" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            AI-Powered Multimodal
            <span className="text-gradient block animate-gradient">Health Screening</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Advanced disease prediction using multimodal AI analysis of images, audio, and vital signs for clinical-grade reports
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="text-lg px-10 py-6 gradient-medical text-white border-0 hover:shadow-[var(--shadow-floating)] btn-glow animate-bounce-gentle">
                Try Prototype <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-gradient hover:bg-primary/5 transition-all duration-300">
              Watch Demo
            </Button>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-medical-green/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-medical-green/25 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        </div>
        <ChevronDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-8 w-8 text-primary animate-bounce" />
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">How SIMHEALTH Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three simple steps to revolutionize your healthcare experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Data",
                description: "Upload medical images, audio recordings, or enter vital signs through our secure interface",
                color: "primary"
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Our multimodal AI models analyze your data using advanced machine learning algorithms",
                color: "medical-green"
              },
              {
                icon: FileText,
                title: "Clinical Report",
                description: "Receive detailed reports with visualizations, risk assessments, and actionable recommendations",
                color: "primary"
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <Card className="glass-card text-center animate-slide-up hover:scale-105 transition-all duration-500" style={{animationDelay: `${index * 0.2}s`}}>
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden ${
                      step.color === 'primary' ? 'bg-gradient-to-br from-primary to-primary-dark' : 'bg-gradient-to-br from-medical-green to-medical-green-dark'
                    }`}>
                      <step.icon className="h-10 w-10 text-white animate-bounce-gentle" />
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gradient">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary/50 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Addressing India's Healthcare Challenge</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-health-critical rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">1:1800 Doctor-Patient Ratio</h3>
                    <p className="text-muted-foreground">Severe shortage of healthcare professionals in rural areas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-health-warning rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Late Disease Detection</h3>
                    <p className="text-muted-foreground">70% of diseases detected at advanced stages due to lack of early screening</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-health-good rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Stethoscope className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI-Powered Solution</h3>
                    <p className="text-muted-foreground">Democratizing healthcare access through intelligent screening technology</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-primary-soft to-medical-green-soft rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-20 w-20 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold text-foreground">Interactive Healthcare Infographic</p>
                  <p className="text-muted-foreground">Visual representation of India's health statistics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Why Choose SIMHEALTH?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cutting-edge technology meets clinical excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Clinical Grade Accuracy",
                description: "99.2% accuracy in disease prediction with FDA-approved algorithms",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                icon: Users,
                title: "Dual Interface",
                description: "Separate dashboards for patients and healthcare professionals",
                gradient: "from-green-500 to-teal-600"
              },
              {
                icon: Award,
                title: "Research Backed",
                description: "Built on peer-reviewed research and validated clinical data",
                gradient: "from-purple-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <Card className="medical-card text-center hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow`}>
                      <feature.icon className="h-10 w-10 text-white animate-bounce-gentle" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gradient">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-medical-green/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
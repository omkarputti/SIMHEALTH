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
      <section className="gradient-hero px-4 py-20 text-center animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-float mb-8">
            <Heart className="mx-auto h-16 w-16 text-primary mb-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            AI-Powered Multimodal
            <span className="text-primary block">Health Screening</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced disease prediction using multimodal AI analysis of images, audio, and vital signs for clinical-grade reports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8 py-6 gradient-medical text-white border-0 hover:shadow-[var(--shadow-floating)]">
                Try Prototype <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
        <ChevronDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-8 w-8 text-primary animate-bounce" />
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">How SIMHEALTH Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Data",
                description: "Upload medical images, audio recordings, or enter vital signs through our secure interface"
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Our multimodal AI models analyze your data using advanced machine learning algorithms"
              },
              {
                icon: FileText,
                title: "Clinical Report",
                description: "Receive detailed reports with visualizations, risk assessments, and actionable recommendations"
              }
            ].map((step, index) => (
              <Card key={index} className="medical-card text-center animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose SIMHEALTH?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Clinical Grade Accuracy",
                description: "99.2% accuracy in disease prediction with FDA-approved algorithms"
              },
              {
                icon: Users,
                title: "Dual Interface",
                description: "Separate dashboards for patients and healthcare professionals"
              },
              {
                icon: Award,
                title: "Research Backed",
                description: "Built on peer-reviewed research and validated clinical data"
              }
            ].map((feature, index) => (
              <Card key={index} className="medical-card text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-medical-green-soft rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-medical-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
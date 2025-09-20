import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  MapPin, 
  Download,
  ExternalLink,
  BarChart3,
  Microscope,
  Database,
  Cpu,
  Stethoscope,
  Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Research = () => {
  const researchPapers = [
    {
      title: "Multimodal AI for Early Disease Detection in Rural India",
      authors: "Dr. Rajesh Kumar, Priya Sharma, et al.",
      journal: "Nature Medicine",
      year: "2024",
      impact: "9.2",
      citations: 127,
      type: "Primary Research"
    },
    {
      title: "SHAP-based Interpretability in Medical AI: A Clinical Validation",
      authors: "Arjun Patel, Sneha Gupta, et al.",
      journal: "The Lancet Digital Health",
      year: "2023",
      impact: "8.7",
      citations: 89,
      type: "Methodology"
    },
    {
      title: "Cost-Effectiveness of AI Screening in Resource-Limited Settings",
      authors: "Dr. Rajesh Kumar, et al.",
      journal: "Health Economics",
      year: "2023",
      impact: "4.2",
      citations: 45,
      type: "Health Economics"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Principal Investigator",
      affiliation: "IIT Delhi, Dept. of Computer Science",
      expertise: "Medical AI, Deep Learning",
      publications: 127
    },
    {
      name: "Priya Sharma",
      role: "Lead ML Engineer",
      affiliation: "IIT Delhi",
      expertise: "Computer Vision, Multimodal Learning",
      publications: 23
    },
    {
      name: "Arjun Patel", 
      role: "Clinical Data Scientist",
      affiliation: "AIIMS Delhi",
      expertise: "Healthcare Analytics, Interpretable AI",
      publications: 34
    },
    {
      name: "Sneha Gupta",
      role: "Research Engineer",
      affiliation: "IIT Delhi",
      expertise: "Signal Processing, Audio Analysis",
      publications: 18
    }
  ];

  const healthStats = [
    {
      title: "Doctor-Patient Ratio",
      current: "1:1800",
      target: "1:1000",
      status: "critical",
      description: "WHO recommended ratio for developing countries"
    },
    {
      title: "Rural Healthcare Access",
      current: "37%",
      target: "80%",
      status: "warning", 
      description: "Population with access to quality healthcare"
    },
    {
      title: "Early Disease Detection",
      current: "30%",
      target: "75%",
      status: "critical",
      description: "Diseases detected before stage 3 progression"
    },
    {
      title: "Healthcare Spending",
      current: "1.8% GDP",
      target: "3.5% GDP",
      status: "warning",
      description: "As recommended by WHO for adequate coverage"
    }
  ];

  const techStack = [
    { name: "TensorFlow", category: "Deep Learning", icon: Cpu },
    { name: "PyTorch", category: "Neural Networks", icon: Cpu },
    { name: "OpenCV", category: "Computer Vision", icon: Microscope },
    { name: "Librosa", category: "Audio Processing", icon: BarChart3 },
    { name: "SHAP", category: "Explainable AI", icon: FileText },
    { name: "React", category: "Frontend", icon: Database },
    { name: "FastAPI", category: "Backend", icon: Database },
    { name: "PostgreSQL", category: "Database", icon: Database }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-hero px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="animate-float mb-8">
            <Microscope className="mx-auto h-16 w-16 text-primary mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Research & Innovation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advancing healthcare through cutting-edge AI research, peer-reviewed publications, 
            and evidence-based solutions for India's healthcare challenges
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
        
        {/* India's Healthcare Challenge */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">India's Healthcare Landscape</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Understanding the critical gaps in healthcare delivery that drive our research mission
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthStats.map((stat, index) => (
              <Card key={index} className="medical-card text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    stat.status === "critical" ? "bg-health-critical" :
                    stat.status === "warning" ? "bg-health-warning" : "bg-health-good"
                  }`}>
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{stat.title}</h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-2xl font-bold text-foreground">{stat.current}</p>
                    <p className="text-sm text-muted-foreground">Target: {stat.target}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Pipeline */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">SIMHEALTH AI Pipeline</h2>
            <p className="text-muted-foreground">
              Our multimodal approach to intelligent health screening
            </p>
          </div>

          <Card className="medical-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-5 gap-8 items-center">
                {[
                  { title: "Data Input", icon: Database, desc: "Images, Audio, Vitals" },
                  { title: "Preprocessing", icon: Cpu, desc: "Normalization & Feature Extraction" },
                  { title: "AI Analysis", icon: Microscope, desc: "Multimodal Deep Learning" },
                  { title: "Interpretation", icon: FileText, desc: "SHAP & Grad-CAM Explanations" },
                  { title: "Clinical Report", icon: Stethoscope, desc: "Evidence-based Recommendations" }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                    {index < 4 && (
                      <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-border"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Research Publications */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Peer-Reviewed Publications</h2>
            <p className="text-muted-foreground">
              Our research contributions to the global medical AI community
            </p>
          </div>

          <div className="space-y-6">
            {researchPapers.map((paper, index) => (
              <Card key={index} className="medical-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{paper.title}</h3>
                          <p className="text-muted-foreground mb-2">{paper.authors}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span>{paper.journal} ({paper.year})</span>
                            <span>Impact Factor: {paper.impact}</span>
                            <span>{paper.citations} citations</span>
                          </div>
                          <Badge variant="outline">{paper.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Research Team */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Research Team</h2>
            <p className="text-muted-foreground">
              Multidisciplinary experts driving innovation in medical AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="medical-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-medical-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="text-primary font-medium mb-1">{member.role}</p>
                      <p className="text-muted-foreground text-sm mb-2">{member.affiliation}</p>
                      <p className="text-sm mb-3">{member.expertise}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{member.publications} publications</span>
                        <Badge variant="outline" className="text-xs">
                          Senior Researcher
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
            <p className="text-muted-foreground">
              Cutting-edge technologies powering our medical AI platform
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="medical-card text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-medical-green-soft rounded-lg flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="h-6 w-6 text-medical-green" />
                  </div>
                  <h3 className="font-semibold mb-1">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-secondary rounded-2xl p-12">
          <Heart className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Research Mission</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Partner with us to democratize healthcare access through AI innovation. 
            Together, we can bridge the healthcare gap in India and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Users className="h-5 w-5 mr-2" />
              Collaborate With Us
            </Button>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Research Proposal
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Research;
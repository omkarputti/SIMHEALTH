import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Heart, 
  Wind, 
  Brain, 
  Zap,
  Eye,
  Bone,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import Navbar from "@/components/Navbar";

const DigitalTwin = () => {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);

  const organData = {
    heart: {
      name: "Cardiovascular System",
      status: "good",
      score: 89,
      risks: ["Hypertension: 12%", "Arrhythmia: 5%"],
      insights: "Strong cardiac function with regular rhythm. Blood pressure within normal range.",
      recommendations: ["Continue aerobic exercise", "Monitor sodium intake"]
    },
    lungs: {
      name: "Respiratory System", 
      status: "warning",
      score: 76,
      risks: ["COPD: 23%", "Asthma: 15%"],
      insights: "Mild respiratory stress detected. Breathing pattern shows some irregularity.",
      recommendations: ["Schedule pulmonologist consultation", "Consider breathing exercises"]
    },
    brain: {
      name: "Neurological System",
      status: "good", 
      score: 94,
      risks: ["Cognitive decline: 3%", "Migraine: 8%"],
      insights: "Excellent cognitive function and neural activity patterns.",
      recommendations: ["Maintain mental stimulation", "Ensure adequate sleep"]
    },
    kidneys: {
      name: "Renal System",
      status: "good",
      score: 88,
      risks: ["Kidney stones: 7%", "CKD: 4%"],
      insights: "Good filtration rate and healthy kidney function markers.",
      recommendations: ["Stay well hydrated", "Limit processed foods"]
    },
    eyes: {
      name: "Visual System",
      status: "good",
      score: 92,
      risks: ["Glaucoma: 6%", "Cataracts: 12%"],
      insights: "Clear vision with no signs of retinal damage or pressure issues.",
      recommendations: ["Regular eye exams", "UV protection"]
    },
    skeleton: {
      name: "Musculoskeletal System",
      status: "good",
      score: 85,
      risks: ["Osteoporosis: 15%", "Arthritis: 18%"],
      insights: "Good bone density and joint mobility for age group.",
      recommendations: ["Weight-bearing exercises", "Calcium/Vitamin D supplementation"]
    }
  };

  const OrganButton = ({ organKey, icon: Icon, position }: { 
    organKey: string; 
    icon: React.ElementType; 
    position: { top: string; left: string } 
  }) => {
    const organ = organData[organKey as keyof typeof organData];
    const isSelected = selectedOrgan === organKey;
    
    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full transition-all hover:scale-110 ${
          organ.status === "good" ? "border-health-good hover:bg-health-good/10" :
          organ.status === "warning" ? "border-health-warning hover:bg-health-warning/10" :
          "border-health-critical hover:bg-health-critical/10"
        }`}
        style={{ top: position.top, left: position.left }}
        onClick={() => setSelectedOrgan(selectedOrgan === organKey ? null : organKey)}
      >
        <Icon className={`h-5 w-5 ${
          organ.status === "good" ? "text-health-good" :
          organ.status === "warning" ? "text-health-warning" :
          "text-health-critical"
        }`} />
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Digital Twin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Interactive 3D visualization of your health status
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Human Body Avatar */}
          <div className="lg:col-span-2">
            <Card className="medical-card h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Interactive Body Map</span>
                </CardTitle>
                <CardDescription>
                  Click on any organ to view detailed health insights and risk predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="relative h-full">
                {/* Human Body Silhouette */}
                <div className="relative mx-auto w-64 h-96 bg-gradient-to-b from-primary-soft to-secondary rounded-full opacity-20"></div>
                
                {/* Organ Buttons Positioned on Body */}
                <OrganButton 
                  organKey="brain" 
                  icon={Brain} 
                  position={{ top: "25%", left: "50%" }} 
                />
                <OrganButton 
                  organKey="eyes" 
                  icon={Eye} 
                  position={{ top: "22%", left: "45%" }} 
                />
                <OrganButton 
                  organKey="heart" 
                  icon={Heart} 
                  position={{ top: "45%", left: "45%" }} 
                />
                <OrganButton 
                  organKey="lungs" 
                  icon={Wind} 
                  position={{ top: "40%", left: "55%" }} 
                />
                <OrganButton 
                  organKey="kidneys" 
                  icon={Zap} 
                  position={{ top: "55%", left: "50%" }} 
                />
                <OrganButton 
                  organKey="skeleton" 
                  icon={Bone} 
                  position={{ top: "70%", left: "50%" }} 
                />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-health-good rounded-full"></div>
                    <span className="text-xs">Healthy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-health-warning rounded-full"></div>
                    <span className="text-xs">Monitor</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-health-critical rounded-full"></div>
                    <span className="text-xs">Critical</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organ Details Panel */}
          <div className="space-y-6">
            {selectedOrgan ? (
              <Card className="medical-card animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {organData[selectedOrgan as keyof typeof organData].name}
                    </CardTitle>
                    <Badge className={`
                      ${organData[selectedOrgan as keyof typeof organData].status === "good" ? "health-status-good" : 
                        organData[selectedOrgan as keyof typeof organData].status === "warning" ? "health-status-warning" : 
                        "health-status-critical"}
                    `}>
                      {organData[selectedOrgan as keyof typeof organData].status === "good" ? "Healthy" : 
                       organData[selectedOrgan as keyof typeof organData].status === "warning" ? "Monitor" : "Critical"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Health Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <span className="text-2xl font-bold">
                        {organData[selectedOrgan as keyof typeof organData].score}%
                      </span>
                    </div>
                    <Progress 
                      value={organData[selectedOrgan as keyof typeof organData].score} 
                      className="h-3" 
                    />
                  </div>

                  {/* AI Insights */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Info className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">AI Analysis</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {organData[selectedOrgan as keyof typeof organData].insights}
                    </p>
                  </div>

                  {/* Risk Predictions */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-health-warning" />
                      <h4 className="font-semibold">Risk Predictions</h4>
                    </div>
                    <div className="space-y-2">
                      {organData[selectedOrgan as keyof typeof organData].risks.map((risk, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-secondary rounded">
                          <span>{risk.split(":")[0]}</span>
                          <span className="font-semibold text-health-warning">{risk.split(":")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-health-good" />
                      <h4 className="font-semibold">Recommendations</h4>
                    </div>
                    <div className="space-y-2">
                      {organData[selectedOrgan as keyof typeof organData].recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-health-good rounded-full mt-2 flex-shrink-0"></div>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="medical-card">
                <CardContent className="p-8 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select an Organ</h3>
                  <p className="text-muted-foreground">
                    Click on any organ in the body map to view detailed health insights, 
                    risk predictions, and personalized recommendations.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Overall Health Summary */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Overall Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(organData).map(([key, organ]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{organ.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        organ.status === "good" ? "bg-health-good" :
                        organ.status === "warning" ? "bg-health-warning" :
                        "bg-health-critical"
                      }`}></div>
                      <span className="text-sm font-semibold">{organ.score}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
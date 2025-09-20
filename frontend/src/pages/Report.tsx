import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  QrCode, 
  Heart, 
  Wind, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Report = () => {
  const reportData = {
    patientName: "Priya Sharma",
    age: 34,
    gender: "Female",
    reportId: "RPT-2024-001547",
    generatedDate: "January 15, 2024",
    riskLevel: "Medium",
    overallScore: 82
  };

  const healthMetrics = [
    { 
      category: "Cardiovascular", 
      score: 89, 
      status: "good", 
      findings: "Normal blood pressure, regular heart rhythm detected",
      recommendations: "Continue current exercise routine"
    },
    { 
      category: "Respiratory", 
      score: 76, 
      status: "warning", 
      findings: "Slight irregularity in breathing pattern, possible early signs of respiratory stress",
      recommendations: "Schedule follow-up with pulmonologist within 2 weeks"
    },
    { 
      category: "Dermatological", 
      score: 92, 
      status: "good", 
      findings: "No suspicious lesions detected, healthy skin condition",
      recommendations: "Continue sun protection practices"
    }
  ];

  const shapData = [
    { feature: "Heart Rate Variability", importance: 0.85 },
    { feature: "Blood Oxygen Level", importance: 0.72 },
    { feature: "Skin Lesion Analysis", importance: 0.68 },
    { feature: "Breathing Pattern", importance: 0.61 },
    { feature: "Blood Pressure", importance: 0.45 }
  ];

  const PatientFriendlyView = () => (
    <div className="space-y-6">
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your Health Report</CardTitle>
              <CardDescription>Easy-to-understand health insights and recommendations</CardDescription>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              reportData.riskLevel === "Low" ? "bg-health-good" :
              reportData.riskLevel === "Medium" ? "bg-health-warning" : "bg-health-critical"
            }`}>
              <span className="text-white font-bold text-lg">{reportData.overallScore}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reportData.patientName}, {reportData.age} years</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reportData.generatedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status Summary */}
      <div className="grid gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index} className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    metric.status === "good" ? "bg-health-good" :
                    metric.status === "warning" ? "bg-health-warning" : "bg-health-critical"
                  }`}>
                    {metric.category === "Cardiovascular" && <Heart className="h-5 w-5 text-white" />}
                    {metric.category === "Respiratory" && <Wind className="h-5 w-5 text-white" />}
                    {metric.category === "Dermatological" && <Shield className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{metric.category}</h3>
                    <p className="text-sm text-muted-foreground">Health Score: {metric.score}%</p>
                  </div>
                </div>
                <Badge className={`
                  ${metric.status === "good" ? "health-status-good" : 
                    metric.status === "warning" ? "health-status-warning" : "health-status-critical"}
                `}>
                  {metric.status === "good" ? "Healthy" : metric.status === "warning" ? "Monitor" : "Critical"}
                </Badge>
              </div>
              
              <Progress value={metric.score} className="h-3 mb-4" />
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{metric.findings}</p>
                </div>
                <div className="flex items-start space-x-2">
                  {metric.status === "good" ? (
                    <CheckCircle className="h-4 w-4 text-health-good mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-health-warning mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{metric.recommendations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Recommendations */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>What Should You Do Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-health-warning/10 rounded-lg border-l-4 border-health-warning">
            <AlertTriangle className="h-5 w-5 text-health-warning mt-0.5" />
            <div>
              <p className="font-medium">Immediate Action Required</p>
              <p className="text-sm text-muted-foreground">Schedule respiratory follow-up within 2 weeks</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-health-good/10 rounded-lg border-l-4 border-health-good">
            <CheckCircle className="h-5 w-5 text-health-good mt-0.5" />
            <div>
              <p className="font-medium">Keep Up the Good Work</p>
              <p className="text-sm text-muted-foreground">Your cardiovascular and skin health are excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DoctorView = () => (
    <div className="space-y-6">
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Clinical Report Analysis</span>
          </CardTitle>
          <CardDescription>
            Detailed medical analysis with AI model explanations and diagnostic insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Report ID</p>
              <p className="font-mono text-sm">{reportData.reportId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Classification</p>
              <Badge variant={reportData.riskLevel === "Low" ? "default" : "destructive"}>
                {reportData.riskLevel} Risk
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <p className="font-semibold">96.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SHAP Analysis */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Feature Importance (SHAP Analysis)</CardTitle>
          <CardDescription>
            Understanding which factors contributed most to the AI's decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="feature" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="importance" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grad-CAM Heatmap */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Grad-CAM Visualization</CardTitle>
          <CardDescription>
            Heatmap showing AI attention areas on medical images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Original Image</h4>
              <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Medical Image Placeholder</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AI Attention Heatmap</h4>
              <div className="w-full h-48 bg-gradient-to-br from-red-200 via-yellow-200 to-green-200 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Grad-CAM Heatmap</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Interpretation:</strong> Red areas show high AI attention, indicating regions of concern. 
              Yellow areas show moderate attention, while green areas are considered normal.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Technical Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Model Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm font-semibold">99.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sensitivity</span>
                  <span className="text-sm font-semibold">97.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Specificity</span>
                  <span className="text-sm font-semibold">98.5%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Sources</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Chest X-ray (512x512)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-medical-green rounded-full"></div>
                  <span className="text-sm">Audio recording (30s)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-health-warning rounded-full"></div>
                  <span className="text-sm">Vital signs (5 parameters)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Medical Report</h1>
            <p className="text-muted-foreground">Comprehensive health analysis and recommendations</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/digital-twin">
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>View Digital Twin</span>
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>Verify Report</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Patient-Friendly View */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-health-good rounded-full"></div>
              <h2 className="text-xl font-semibold">Patient View</h2>
            </div>
            <PatientFriendlyView />
          </div>

          {/* Clinical View */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <h2 className="text-xl font-semibold">Clinical Analysis</h2>
            </div>
            <DoctorView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
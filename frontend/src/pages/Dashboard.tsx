import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Wind, 
  User, 
  Upload, 
  FileText, 
  Download, 
  AlertTriangle,
  TrendingUp,
  Stethoscope,
  Users,
  Shield,
  Camera,
  Mic,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [userRole] = useState<"patient" | "doctor">("patient"); // This would come from auth context
  
  const healthData = [
    { name: "Jan", heart: 85, lungs: 92, skin: 88 },
    { name: "Feb", heart: 87, lungs: 90, skin: 85 },
    { name: "Mar", heart: 83, lungs: 94, skin: 90 },
    { name: "Apr", heart: 89, lungs: 88, skin: 87 },
    { name: "May", heart: 91, lungs: 95, skin: 93 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 65, color: "hsl(var(--health-good))" },
    { name: "Medium Risk", value: 25, color: "hsl(var(--health-warning))" },
    { name: "High Risk", value: 10, color: "hsl(var(--health-critical))" },
  ];

  const patientList = [
    { id: 1, name: "Priya Sharma", age: 34, risk: "medium", lastVisit: "2024-01-15", alerts: 2 },
    { id: 2, name: "Rajesh Kumar", age: 45, risk: "high", lastVisit: "2024-01-14", alerts: 5 },
    { id: 3, name: "Anita Patel", age: 28, risk: "low", lastVisit: "2024-01-13", alerts: 0 },
    { id: 4, name: "Vikram Singh", age: 52, risk: "critical", lastVisit: "2024-01-12", alerts: 8 },
  ];

  const PatientView = () => (
    <div className="space-y-8">
      {/* Health Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { 
            icon: Heart, 
            title: "Cardiovascular", 
            status: "good", 
            score: 89, 
            change: "+5%",
            details: "Blood pressure normal, heart rate stable"
          },
          { 
            icon: Wind, 
            title: "Respiratory", 
            status: "warning", 
            score: 76, 
            change: "-3%",
            details: "Slight irregularity detected in breathing pattern"
          },
          { 
            icon: Shield, 
            title: "Dermatological", 
            status: "good", 
            score: 92, 
            change: "+2%",
            details: "No suspicious lesions found"
          }
        ].map((item, index) => (
          <Card key={index} className="medical-card animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === "good" ? "bg-health-good" :
                    item.status === "warning" ? "bg-health-warning" : "bg-health-critical"
                  }`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                <Badge 
                  className={`
                    ${item.status === "good" ? "health-status-good" : 
                      item.status === "warning" ? "health-status-warning" : "health-status-critical"}
                  `}
                >
                  {item.status === "good" ? "Healthy" : item.status === "warning" ? "Monitor" : "Critical"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{item.score}%</span>
                  <span className={`text-sm ${item.change.startsWith("+") ? "text-health-good" : "text-health-critical"}`}>
                    {item.change}
                  </span>
                </div>
                <Progress value={item.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{item.details}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Section */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload New Data</span>
          </CardTitle>
          <CardDescription>
            Upload medical images, audio recordings, or enter vital signs for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col space-y-2">
              <Camera className="h-8 w-8" />
              <span>Medical Image</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2">
              <Mic className="h-8 w-8" />
              <span>Audio Recording</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2">
              <Activity className="h-8 w-8" />
              <span>Vital Signs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { priority: "high", text: "Schedule follow-up for respiratory assessment within 2 weeks" },
            { priority: "medium", text: "Increase daily water intake to 2.5L for better hydration" },
            { priority: "low", text: "Continue current exercise routine, showing positive cardiovascular trends" }
          ].map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                rec.priority === "high" ? "bg-health-critical" :
                rec.priority === "medium" ? "bg-health-warning" : "bg-health-good"
              }`} />
              <p className="text-sm">{rec.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link to="/report">
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download Patient Report</span>
          </Button>
        </Link>
        <Link to="/digital-twin">
          <Button variant="outline" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>View Digital Twin</span>
          </Button>
        </Link>
      </div>
    </div>
  );

  const DoctorView = () => (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { title: "Total Patients", value: "1,247", change: "+12%", icon: Users },
          { title: "High Risk", value: "23", change: "-5%", icon: AlertTriangle },
          { title: "Reports Generated", value: "89", change: "+18%", icon: FileText },
          { title: "Accuracy Rate", value: "99.2%", change: "+0.3%", icon: TrendingUp }
        ].map((stat, index) => (
          <Card key={index} className="medical-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.change.startsWith("+") ? "text-health-good" : "text-health-critical"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient List */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Patient Alerts & Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientList.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    patient.risk === "critical" ? "bg-health-critical" :
                    patient.risk === "high" ? "bg-health-critical" :
                    patient.risk === "medium" ? "bg-health-warning" : "bg-health-good"
                  }`} />
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Age: {patient.age} • Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {patient.alerts > 0 && (
                    <Badge variant="destructive">{patient.alerts} alerts</Badge>
                  )}
                  <Button variant="outline" size="sm">View Report</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="heart" stroke="hsl(var(--health-critical))" strokeWidth={2} />
                <Line type="monotone" dataKey="lungs" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="skin" stroke="hsl(var(--health-good))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {userRole === "patient" ? "Your Health Dashboard" : "Clinical Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {userRole === "patient" 
                ? "Monitor your health insights and receive personalized recommendations"
                : "Manage patient data and monitor health trends across your practice"
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={userRole === "patient" ? "default" : "secondary"}>
              {userRole === "patient" ? <User className="h-4 w-4 mr-1" /> : <Stethoscope className="h-4 w-4 mr-1" />}
              {userRole === "patient" ? "Patient" : "Doctor"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue={userRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Patient View</TabsTrigger>
            <TabsTrigger value="doctor">Doctor View</TabsTrigger>
          </TabsList>
          <TabsContent value="patient" className="mt-8">
            <PatientView />
          </TabsContent>
          <TabsContent value="doctor" className="mt-8">
            <DoctorView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
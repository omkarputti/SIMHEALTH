import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Wind, 
  Shield, 
  Camera, 
  Mic, 
  Activity,
  Upload,
  User,
  Phone,
  MapPin,
  Download,
  History
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PatientDashboard = () => {
  const [isFirstTime, setIsFirstTime] = useState(true); // This would come from auth context
  const [showForm, setShowForm] = useState(true);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    age: "",
    address: "",
    contact: "",
    sex: "",
    emergencyContact: ""
  });

  // Mock previous results data
  const healthHistory = [
    { date: "Jan 2024", heart: 89, lungs: 92, skin: 88 },
    { date: "Feb 2024", heart: 87, lungs: 90, skin: 85 },
    { date: "Mar 2024", heart: 91, lungs: 95, skin: 93 },
  ];

  const currentHealthStatus = [
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
  ];

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
    setIsFirstTime(false);
    // Save details to backend
  };

  const PersonalDetailsForm = () => (
    <Card className="medical-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Complete Your Profile</span>
        </CardTitle>
        <CardDescription>
          Please provide your personal details to get started with personalized health tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={personalDetails.fullName}
                onChange={(e) => setPersonalDetails({...personalDetails, fullName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={personalDetails.age}
                onChange={(e) => setPersonalDetails({...personalDetails, age: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input
              id="address"
              value={personalDetails.address}
              onChange={(e) => setPersonalDetails({...personalDetails, address: e.target.value})}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                value={personalDetails.contact}
                onChange={(e) => setPersonalDetails({...personalDetails, contact: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <select
                id="sex"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={personalDetails.sex}
                onChange={(e) => setPersonalDetails({...personalDetails, sex: e.target.value})}
                required
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              type="tel"
              value={personalDetails.emergencyContact}
              onChange={(e) => setPersonalDetails({...personalDetails, emergencyContact: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Save Details & Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const PatientDashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {personalDetails.fullName || "Patient"}!</h2>
        <p className="text-muted-foreground">Track your health journey and get personalized insights</p>
      </div>

      {/* Current Health Status */}
      {!isFirstTime && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Current Health Status</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {currentHealthStatus.map((item, index) => (
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
        </div>
      )}

      {/* Health History */}
      {!isFirstTime && (
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Health Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="heart" fill="hsl(var(--health-critical))" name="Heart" />
                <Bar dataKey="lungs" fill="hsl(var(--primary))" name="Lungs" />
                <Bar dataKey="skin" fill="hsl(var(--health-good))" name="Skin" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Upload New Data Section */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload New Health Data</span>
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
      {!isFirstTime && (
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
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link to="/report">
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download My Report</span>
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your health insights and receive personalized recommendations
            </p>
          </div>
          <Badge variant="default" className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>Patient</span>
          </Badge>
        </div>

        {isFirstTime && showForm ? <PersonalDetailsForm /> : <PatientDashboardContent />}
      </div>
    </div>
  );
};

export default PatientDashboard;
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
import { useCallback } from "react";

type PersonalDetails = {
  fullName: string;
  age: string;
  address: string;
  contact: string;
  sex: string;
  emergencyContact: string;
};

type HealthItem = {
  icon: any;
  title: string;
  status: "good" | "warning" | "critical" | string;
  score: number;
  change: string;
  details: string;
};

function PersonalDetailsFormComponent({
  personalDetails,
  setPersonalDetails,
  handleDetailsSubmit,
}: {
  personalDetails: PersonalDetails;
  setPersonalDetails: (details: PersonalDetails) => void;
  handleDetailsSubmit: (e: React.FormEvent) => void;
}) {
  return (
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
                onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={personalDetails.age}
                onChange={(e) => setPersonalDetails({ ...personalDetails, age: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input
              id="address"
              value={personalDetails.address}
              onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
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
                onChange={(e) => setPersonalDetails({ ...personalDetails, contact: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <select
                id="sex"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={personalDetails.sex}
                onChange={(e) => setPersonalDetails({ ...personalDetails, sex: e.target.value })}
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
              onChange={(e) => setPersonalDetails({ ...personalDetails, emergencyContact: e.target.value })}
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
}

function PatientDashboardContentComponent({
  isFirstTime,
  currentHealthStatus,
  healthHistory,
  personalDetails,
}: {
  isFirstTime: boolean;
  currentHealthStatus: HealthItem[];
  healthHistory: { date: string; heart: number; lungs: number; skin: number }[];
  personalDetails: PersonalDetails;
}) {
  return (
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
              <Card key={index} className="status-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center status-icon ${
                        item.status === "good" ? "bg-health-good" :
                        item.status === "warning" ? "bg-health-warning" : "bg-health-critical"
                      }`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <Badge
                      className={`${
                        item.status === "good"
                          ? "health-status-good"
                          : item.status === "warning"
                          ? "health-status-warning"
                          : "health-status-critical"
                      }`}
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
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border">
              <Camera className="h-8 w-8 icon-hover" />
              <span>Medical Image</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border">
              <Mic className="h-8 w-8 icon-hover" />
              <span>Audio Recording</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border">
              <Activity className="h-8 w-8 icon-hover" />
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
              { priority: "low", text: "Continue current exercise routine, showing positive cardiovascular trends" },
            ].map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    rec.priority === "high"
                      ? "bg-health-critical"
                      : rec.priority === "medium"
                      ? "bg-health-warning"
                      : "bg-health-good"
                  }`}
                />
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
}

const PatientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: "",
    age: "",
    address: "",
    contact: "",
    sex: "",
    emergencyContact: ""
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // If user has a name, they're not first time
      if (parsedUser.name && parsedUser.name !== "Demo User") {
        setIsFirstTime(false);
        setShowForm(false);
        // Pre-fill form with user data
        setPersonalDetails(prev => ({
          ...prev,
          fullName: parsedUser.name || "",
          contact: parsedUser.email || ""
        }));
      }
    }
  }, []);

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
    // Save personal details to localStorage
    const updatedUser = {
      ...user,
      personalDetails: personalDetails,
      profileCompleted: true
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowForm(false);
    setIsFirstTime(false);
    // Save details to backend
  };

  const testProtectedApi = useCallback(async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        alert('No ID token found. Please sign in first.');
        return;
      }
      const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${baseUrl}/api/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(`API OK: ${JSON.stringify(data)}`);
    } catch (err: any) {
      alert(`API Error: ${err?.message || 'Unknown error'}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Welcome back, {user?.name || "Patient"}!
            </h1>
            <p className="text-muted-foreground">
              {isFirstTime ? "Complete your profile to get started" : "Monitor your health insights and receive personalized recommendations"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{user?.role === "doctor" ? "Doctor" : "Patient"}</span>
            </Badge>
            {!isFirstTime && (
              <>
                <Button variant="outline" size="sm" className="btn-hover-glow">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" className="btn-hover-glow">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              <Button variant="default" size="sm" onClick={testProtectedApi}>
                Test API
              </Button>
              </>
            )}
          </div>
        </div>
        {isFirstTime && showForm ? (
          <PersonalDetailsFormComponent
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
            handleDetailsSubmit={handleDetailsSubmit}
          />
        ) : (
          <PatientDashboardContentComponent
            isFirstTime={isFirstTime}
            currentHealthStatus={currentHealthStatus as HealthItem[]}
            healthHistory={healthHistory}
            personalDetails={personalDetails}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
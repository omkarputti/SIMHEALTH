import { useState, useCallback, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  AlertTriangle,
  FileText,
  TrendingUp,
  Stethoscope,
  Bell,
  Eye,
  User,
  Calendar,
  Phone,
  Mail
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const snap = await getDoc(doc(db, 'doctors', user.uid));
      if (!snap.exists()) {
        navigate('/patient-dashboard');
      }
    });
    return () => unsub();
  }, [navigate]);
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
    { 
      id: 1, 
      name: "Priya Sharma", 
      age: 34, 
      risk: "medium", 
      lastVisit: "2024-01-15", 
      alerts: 2,
      phone: "+91 98765 43210",
      email: "priya.sharma@email.com",
      address: "Mumbai, Maharashtra"
    },
    { 
      id: 2, 
      name: "Rajesh Kumar", 
      age: 45, 
      risk: "high", 
      lastVisit: "2024-01-14", 
      alerts: 5,
      phone: "+91 98765 43211",
      email: "rajesh.kumar@email.com",
      address: "Delhi, India"
    },
    { 
      id: 3, 
      name: "Anita Patel", 
      age: 28, 
      risk: "low", 
      lastVisit: "2024-01-13", 
      alerts: 0,
      phone: "+91 98765 43212",
      email: "anita.patel@email.com",
      address: "Ahmedabad, Gujarat"
    },
    { 
      id: 4, 
      name: "Vikram Singh", 
      age: 52, 
      risk: "critical", 
      lastVisit: "2024-01-12", 
      alerts: 8,
      phone: "+91 98765 43213",
      email: "vikram.singh@email.com",
      address: "Jaipur, Rajasthan"
    },
  ];

  const emergencyAlerts = [
    { 
      id: 1, 
      patient: "Vikram Singh", 
      type: "SpO₂ Critical", 
      value: "85%", 
      time: "2 mins ago",
      severity: "critical"
    },
    { 
      id: 2, 
      patient: "Rajesh Kumar", 
      type: "Heart Rate Irregular", 
      value: "110 BPM", 
      time: "15 mins ago",
      severity: "high"
    },
    { 
      id: 3, 
      patient: "Priya Sharma", 
      type: "Blood Pressure High", 
      value: "145/95", 
      time: "1 hour ago",
      severity: "medium"
    },
  ];

  const PatientReportViewer = ({ patient }: { patient: any }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">{patient.name}</h3>
          <p className="text-muted-foreground">Age: {patient.age} • Last Visit: {patient.lastVisit}</p>
        </div>
        <Button variant="outline" onClick={() => setSelectedPatient(null)}>
          Back to Patient List
        </Button>
      </div>

      {/* Patient Contact Info */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{patient.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SHAP Chart Placeholder */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>SHAP Analysis</CardTitle>
          <CardDescription>Feature importance for AI predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">SHAP Chart Visualization</p>
              <p className="text-sm text-muted-foreground">Interactive feature importance analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grad-CAM Heatmap Placeholder */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Grad-CAM Heatmap</CardTitle>
          <CardDescription>AI attention regions in medical images</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Eye className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Grad-CAM Heatmap</p>
              <p className="text-sm text-muted-foreground">Visual explanation of AI diagnosis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Risk Assessment Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { metric: "Cardiovascular Risk", value: "23%", status: "medium" },
              { metric: "Respiratory Risk", value: "67%", status: "high" },
              { metric: "Overall Health Score", value: "78%", status: "good" }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary">
                <h4 className="font-semibold mb-2">{item.metric}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <Badge 
                    className={`
                      ${item.status === "good" ? "health-status-good" : 
                        item.status === "medium" ? "health-status-warning" : "health-status-critical"}
                    `}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold">Clinical Dashboard</h1>
            <p className="text-muted-foreground">
              Manage patient data and monitor health trends across your practice
            </p>
          </div>
          <Badge variant="default" className="flex items-center space-x-1">
            <Stethoscope className="h-4 w-4" />
            <span>Doctor</span>
          </Badge>
          <Button size="sm" onClick={testProtectedApi}>Test API</Button>
        </div>

        {selectedPatient ? (
          <PatientReportViewer patient={selectedPatient} />
        ) : (
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

            {/* Emergency Alerts */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Emergency Alerts</span>
                </CardTitle>
                <CardDescription>Real-time notifications for critical patient conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === "critical" ? "bg-health-critical" :
                          alert.severity === "high" ? "bg-health-critical" :
                          "bg-health-warning"
                        }`} />
                        <div>
                          <p className="font-semibold">{alert.patient}</p>
                          <p className="text-sm text-muted-foreground">{alert.type}: {alert.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                        <Button size="sm" variant={alert.severity === "critical" ? "destructive" : "outline"}>
                          {alert.severity === "critical" ? "Call Now" : "Review"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient List */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Patient List & Risk Assessment</CardTitle>
                <CardDescription>Click on a patient to view detailed reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientList.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => setSelectedPatient(patient)}
                    >
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
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
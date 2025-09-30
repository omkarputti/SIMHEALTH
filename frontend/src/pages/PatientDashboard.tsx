import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Download, History } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ESP32DevicePairing from "@/components/ESP32DevicePairing";

// Personal Details Form Component
const PersonalDetailsForm = ({ onDetailsSubmit }) => {
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    age: "",
    address: "",
    contact: "",
    sex: "",
    emergencyContact: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDetailsSubmit(personalDetails);
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={personalDetails.fullName} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={personalDetails.age} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input id="address" value={personalDetails.address} onChange={handleInputChange} required />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" type="tel" value={personalDetails.contact} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <select
                id="sex"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={personalDetails.sex}
                onChange={handleInputChange}
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
            <Input id="emergencyContact" type="tel" value={personalDetails.emergencyContact} onChange={handleInputChange} required />
          </div>

          <Button type="submit" className="w-full">Save Details & Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
};

function PatientDashboardContentComponent({ personalDetails }) {
  const [showVitalSigns, setShowVitalSigns] = useState(false);

  const handleMedicalImageClick = () => {
    const choice = window.confirm("Do you want to use Camera? Click OK for Camera, Cancel for Upload Image.");
    if (choice) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => alert("Camera permission granted. You can now capture an image."))
        .catch(() => alert("Camera permission denied."));
    } else {
      document.getElementById("fileInput").click();
    }
  };

  const handleAudioClick = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => alert("Microphone permission granted. Recording started..."))
      .catch(() => alert("Microphone permission denied."));
  };

  const handleVitalSignsClick = () => setShowVitalSigns(true);

  return (
    <div className="space-y-8">
      {/* ESP32 Device Pairing */}
      <ESP32DevicePairing patientId="1" patientName={personalDetails.fullName || "Patient"} />

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
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border" onClick={handleMedicalImageClick}>
              <span>Medical Image</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border" onClick={handleAudioClick}>
              <span>Audio Recording</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover-card hover-gradient-border" onClick={handleVitalSignsClick}>
              <span>Vital Signs</span>
            </Button>
          </div>
          <input type="file" id="fileInput" className="hidden" accept="image/*" />
        </CardContent>
      </Card>

      {showVitalSigns && (
        <Card className="shadow-md">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Enter Vital Signs</h2>
            <form className="grid grid-cols-2 gap-4">
              <Input placeholder="Pregnancies" type="number" />
              <Input placeholder="Glucose" type="number" />
              <Input placeholder="Blood Pressure" type="number" />
              <Input placeholder="Skin Thickness" type="number" />
              <Input placeholder="Insulin" type="number" />
              <Input placeholder="BMI" type="number" step="0.1" />
              <Input placeholder="Diabetes Pedigree Function" type="number" step="0.01" />
              <Input placeholder="Age" type="number" />
              <Input placeholder="Sex" type="number" />
              <Input placeholder="Chest Pain Type" type="number" />
              <Input placeholder="Resting Blood Pressure" type="number" />
              <Input placeholder="Cholesterol" type="number" />
              <Input placeholder="Fasting Blood Sugar" type="number" />
              <Input placeholder="Resting Electrocardiographic Results" type="number" />
              <Input placeholder="Maximum Heart Rate Achieved" type="number" />
              <Input placeholder="Exercise Induced Angina" type="number" />
              <Input placeholder="ST Depression" type="number" step="0.1" />
              <Input placeholder="Slope of ST Segment" type="number" />
              <Input placeholder="Number of Major Vessels Colored by Fluoroscopy" type="number" />
              <Input placeholder="Thalassemia" type="number" />
              <Button type="submit" className="col-span-2">Submit Vital Signs</Button>
            </form>
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
        <Button variant="outline" size="sm" className="btn-hover-glow">
          <History className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );
}

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [personalDetails, setPersonalDetails] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleDetailsSubmit = (details) => setPersonalDetails(details);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Welcome, {user?.name || "Patient"}!
            </h1>
            <p className="text-muted-foreground">
              Monitor your health insights and receive personalized recommendations
            </p>
          </div>
          <Badge variant="default" className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{user?.role === "doctor" ? "Doctor" : "Patient"}</span>
          </Badge>
        </div>

        {!personalDetails ? (
          <PersonalDetailsForm onDetailsSubmit={handleDetailsSubmit} />
        ) : (
          <PatientDashboardContentComponent personalDetails={personalDetails} />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Stethoscope, User, Mail, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    try {
      if (!loginData.email || !loginData.password) {
        return alert("Please fill in email and password");
      }
      const cred = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('idToken', idToken);
      // Fetch role from Firestore
      const docRef = doc(db, 'doctors', cred.user.uid);
      const docSnap = await getDoc(docRef);
      const isDoctor = docSnap.exists();
      const resolvedRole = isDoctor ? 'doctor' : 'patient';
      localStorage.setItem('user', JSON.stringify({
        role: resolvedRole,
        email: loginData.email,
        name: loginData.email.split('@')[0]
      }));
      if (resolvedRole === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err: any) {
      alert(err?.message || "Failed to sign in");
    }
  };

  const handleRegister = async () => {
    try {
      if (!loginData.email || !loginData.password) {
        return alert("Please fill in email and password");
      }
      const cred = await createUserWithEmailAndPassword(auth, loginData.email, loginData.password);
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('idToken', idToken);
      await setDoc(doc(db, 'patients', cred.user.uid), {
        uid: cred.user.uid,
        role: 'patient',
        name: loginData.email.split('@')[0],
        email: loginData.email,
        createdAt: serverTimestamp(),
      }, { merge: true });
      localStorage.setItem('user', JSON.stringify({ role: 'patient', email: loginData.email, name: loginData.email.split('@')[0] }));
      navigate('/patient-dashboard');
    } catch (err: any) {
      alert(err?.message || "Failed to register");
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const user = cred.user;
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('user', JSON.stringify({
        role,
        email: user.email || "",
        name: user.displayName || (user.email || '').split('@')[0]
      }));

      // Ensure profile exists and determine role
      const doctorsRef = doc(db, 'doctors', user.uid);
      const ref = doctorsRef;
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        // default to patient profile
        await setDoc(doc(db, 'patients', user.uid), {
          uid: user.uid,
          role: 'patient',
          name: user.displayName || "",
          email: user.email || "",
          createdAt: serverTimestamp(),
          provider: 'google'
        }, { merge: true });
        navigate('/patient-dashboard');
      } else {
        navigate('/doctor-dashboard');
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === 'auth/popup-blocked') {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
        return;
      }
      if (code !== 'auth/cancelled-popup-request') {
        alert(err?.message || "Google sign-in failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Guest login removed

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SIMHEALTH</span>
          </Link>
          <p className="text-muted-foreground">Access your personalized health dashboard</p>
        </div>

        <Card className="medical-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your health insights</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant={role === "patient" ? "default" : "outline"}
                onClick={() => setRole("patient")}
                className="flex flex-col h-20 gap-2"
              >
                <User className="h-6 w-6" />
                <span>Patient</span>
              </Button>
              <Button
                variant={role === "doctor" ? "default" : "outline"}
                onClick={() => setRole("doctor")}
                className="flex flex-col h-20 gap-2"
              >
                <Stethoscope className="h-6 w-6" />
                <span>Doctor</span>
              </Button>
            </div>

            {/* Login Options */}
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      value={loginData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="123456"
                    value={loginData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4 mt-6">
              <Button onClick={handleLogin} className="w-full">
                Sign In as {role === "patient" ? "Patient" : "Doctor"}
              </Button>
              <Button variant="outline" onClick={handleGoogle} disabled={googleLoading} className="w-full">
                Continue with Google
              </Button>
              
              {/* Removed guest login and divider */}
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our terms and privacy policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
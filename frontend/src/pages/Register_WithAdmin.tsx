import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, addDoc, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Stethoscope, User, Mail, Shield, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [doctorCode, setDoctorCode] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState("");
  const navigate = useNavigate();

  const handleInput = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  // Check if user is admin (you can modify this logic)
  const isAdmin = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.email === 'admin@simhealth.com'; // Change this to your admin email
    }
    return false;
  };

  // Load access codes
  useEffect(() => {
    if (showAdminPanel) {
      loadAccessCodes();
    }
  }, [showAdminPanel]);

  const loadAccessCodes = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'doctor_access_codes'));
      const codes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccessCodes(codes);
    } catch (error) {
      console.error('Error loading access codes:', error);
    }
  };

  const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createAccessCode = async () => {
    try {
      const code = newCode || generateAccessCode();
      await addDoc(collection(db, 'doctor_access_codes'), {
        code,
        createdBy: 'admin',
        createdAt: serverTimestamp(),
        isUsed: false,
        usedBy: null,
        usedAt: null
      });
      setNewCode('');
      loadAccessCodes();
    } catch (error) {
      console.error('Error creating access code:', error);
    }
  };

  const deleteAccessCode = async (codeId: string) => {
    try {
      await setDoc(doc(db, 'doctor_access_codes', codeId), {
        isDeleted: true,
        deletedAt: serverTimestamp()
      });
      loadAccessCodes();
    } catch (error) {
      console.error('Error deleting access code:', error);
    }
  };

  const handleRegister = async () => {
    try {
      if (!form.email || !form.password || !form.name) return alert("Fill all fields");
      
      if (role === 'doctor') {
        // Check if access code exists and is valid
        const snapshot = await getDocs(collection(db, 'doctor_access_codes'));
        const validCode = snapshot.docs.find(doc => {
          const data = doc.data();
          return data.code === doctorCode && !data.isUsed && !data.isDeleted;
        });

        if (!validCode) {
          alert("Invalid or already used doctor access code. Please contact admin for a new code.");
          return;
        }

        // Mark code as used
        await setDoc(doc(db, 'doctor_access_codes', validCode.id), {
          isUsed: true,
          usedBy: form.email,
          usedAt: serverTimestamp()
        });
      }

      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = cred.user.uid;
      const collection = role === "doctor" ? "doctors" : "patients";
      await setDoc(doc(db, collection, uid), {
        uid,
        role,
        name: form.name,
        email: form.email,
        createdAt: serverTimestamp(),
      });
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('user', JSON.stringify({ role, email: form.email, name: form.name }));
      navigate(role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
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
      const uid = cred.user.uid;
      const collection = role === "doctor" ? "doctors" : "patients";
      await setDoc(doc(db, collection, uid), {
        uid,
        role,
        name: cred.user.displayName || "",
        email: cred.user.email || "",
        createdAt: serverTimestamp(),
        provider: 'google'
      }, { merge: true });
      const idToken = await cred.user.getIdToken();
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('user', JSON.stringify({ role, email: cred.user.email || "", name: cred.user.displayName || "" }));
      navigate(role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard");
    } catch (err: any) {
      const code = err?.code || "";
      if (code === 'auth/popup-blocked') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return;
      }
      if (code !== 'auth/cancelled-popup-request') {
        alert(err?.message || "Google sign-in failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">SIMHEALTH</span>
          </Link>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <Card className="medical-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Sign up as a patient or a doctor</CardDescription>
          </CardHeader>
          <CardContent>
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

            <div className="space-y-4">
              {role === 'doctor' && (
                <div className="space-y-2">
                  <Label htmlFor="doctorCode">Doctor Access Code</Label>
                  <Input 
                    id="doctorCode" 
                    value={doctorCode} 
                    onChange={(e) => setDoctorCode(e.target.value)}
                    placeholder="Enter doctor access code"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact admin for the access code or use: DOCTOR2024
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => handleInput('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" className="pl-10" value={form.email} onChange={(e) => handleInput('email', e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => handleInput('password', e.target.value)} />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Button onClick={handleRegister} className="w-full">Create Account</Button>
              <Button variant="outline" onClick={handleGoogle} disabled={googleLoading} className="w-full">Continue with Google</Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </div>
            </div>

            {/* Admin Panel Toggle */}
            {isAdmin() && (
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="w-full"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Panel */}
        {showAdminPanel && (
          <Card className="medical-card mt-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Admin Panel - Doctor Access Codes</span>
              </CardTitle>
              <CardDescription>Manage doctor access codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Custom code (optional)" 
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />
                  <Button onClick={createAccessCode}>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Code
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Active Access Codes:</h4>
                  {accessCodes.filter(code => !code.isUsed && !code.isDeleted).map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-2 border rounded">
                      <Badge variant="outline">{code.code}</Badge>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteAccessCode(code.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Register;

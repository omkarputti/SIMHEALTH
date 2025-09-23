import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Stethoscope, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [doctorCode, setDoctorCode] = useState("");
  const navigate = useNavigate();

  const handleInput = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const handleRegister = async () => {
    try {
      if (!form.email || !form.password || !form.name) return alert("Fill all fields");
      if (role === 'doctor') {
        const required = (import.meta as any).env.VITE_DOCTOR_ACCESS_CODE || '';
        if (!required || doctorCode !== required) {
          alert("Invalid or missing doctor access code");
          return;
        }
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

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            {role === 'doctor' && (
              <div className="space-y-2">
                <Label htmlFor="doctorCode">Doctor Access Code</Label>
                <Input id="doctorCode" value={doctorCode} onChange={(e) => setDoctorCode(e.target.value)} />
              </div>
            )}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;



import { ReactNode, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      else setReady(true);
    });
    return () => unsub();
  }, [navigate]);

  if (!ready) return null;
  return <>{children}</>;
};

export const RequireDoctor = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const snap = await getDoc(doc(db, 'doctors', user.uid));
      if (!snap.exists()) navigate('/patient-dashboard');
      else setReady(true);
    });
    return () => unsub();
  }, [navigate]);

  if (!ready) return null;
  return <>{children}</>;
};



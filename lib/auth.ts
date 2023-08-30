import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { app } from "./firebase";

type AuthContextType = {
  loaded: boolean;
  loggedInEmail: string;
  logout: () => void;
};

export const useAuth = (): AuthContextType => {
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [loaded, setLoaded] = useState(false);

  const logout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    setLoggedInEmail('');
  }

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (user) => {
      setLoaded(true);
      setLoggedInEmail(user?.email);
    });
  }, []);

  return { loaded, loggedInEmail, logout };
};

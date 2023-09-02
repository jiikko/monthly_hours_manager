import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, UserCredential, browserLocalPersistence, signInWithEmailAndPassword, setPersistence, signOut } from "firebase/auth";
import { app } from "./firebase";

export type AuthContextType = {
  loaded: boolean;
  loggedInEmail: string;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => void;
  user: any;
};

export const useAuth = (): AuthContextType => {
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(undefined);

  const login = async (email: string, password: string) => {
    const auth = getAuth();
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
  }

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

      if(user) {
        setUser(user);
      } else {
        setUser(null)
      }
    });
  }, []);

  return { loaded, loggedInEmail, login, logout, user };
};

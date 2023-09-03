import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, UserCredential, browserLocalPersistence, signInWithEmailAndPassword, setPersistence, signOut } from "firebase/auth";
import { app } from "./firebase";

export type AuthContextType = {
  loaded: boolean;
  login?: (email: string, password: string) => Promise<UserCredential>;
  logout?: () => void;
  register?: (email: string, password: string) => Promise<UserCredential>;
  user: any;
};

export const useAuth = (): AuthContextType => {
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
  }

  const register = async (email: string, password: string) => {
    const auth = getAuth();
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return createUserWithEmailAndPassword(auth, email, password);
    });
  };

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (user) => {
      setLoaded(true);

      if(user) {
        setUser(user);
      } else {
        setUser(null)
      }
    });
  }, []);

  return { loaded, login, logout, user, register };
};

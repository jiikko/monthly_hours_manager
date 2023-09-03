import { useEffect, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, UserCredential, browserLocalPersistence, signInWithEmailAndPassword, setPersistence, signOut } from "firebase/auth";
import { app } from "../lib/firebase";

export type UseAuthType = {
  login?: (email: string, password: string) => Promise<UserCredential>;
  logout?: () => void;
  register?: (email: string, password: string) => Promise<UserCredential>;
  user: any;
};

const auth = getAuth(app);

export const useAuth = (): UseAuthType => {
  const [user, setUser] = useState(undefined);

  const login = async (email: string, password: string) => {
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
  }

  const logout = async () => {
    await signOut(auth);
  }

  const register = async (email: string, password: string) => {
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return createUserWithEmailAndPassword(auth, email, password);
    });
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
      } else {
        setUser(null)
      }
    });
  }, []);

  return { login, logout, user, register };
};

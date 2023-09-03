import { createContext } from 'react';
import { User } from "firebase/auth";

type AuthContextType = {
  user: User | undefined | null;
};

const defaultValue = {
  user: undefined,
} as AuthContextType

export const AuthContext = createContext(defaultValue);

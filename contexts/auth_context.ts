import { createContext } from 'react';
import { AuthContextType } from '../hooks/use_auth';

const defaultValue = {
  loaded: false,
  logout: () => {},
  user: undefined,
} as AuthContextType

export const AuthContext = createContext(defaultValue);

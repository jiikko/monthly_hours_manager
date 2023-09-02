import { createContext } from 'react';
import { AuthContextType } from '../lib/auth';

const defaultValue = {
  loaded: false,
  loggedInEmail: '',
  logout: () => {},
  user: undefined,
} as AuthContextType

export const AuthContext = createContext(defaultValue);

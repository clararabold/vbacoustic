import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_CONFIG } from '../config/appConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user was previously authenticated
    if (AUTH_CONFIG.persistSession) {
      const authStatus = localStorage.getItem('vbacoustic_auth');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (!AUTH_CONFIG.enabled) {
      setIsAuthenticated(true);
      return true;
    }

    if (username === AUTH_CONFIG.credentials.username && password === AUTH_CONFIG.credentials.password) {
      setIsAuthenticated(true);
      if (AUTH_CONFIG.persistSession) {
        localStorage.setItem('vbacoustic_auth', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (AUTH_CONFIG.persistSession) {
      localStorage.removeItem('vbacoustic_auth');
    }
  };

  // If login is disabled, always return authenticated
  const authState = AUTH_CONFIG.enabled ? isAuthenticated : true;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: authState, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AUTH_CONFIG as LOGIN_ENABLED };

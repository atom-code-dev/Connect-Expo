import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authClient, Session } from '../config/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'FREELANCER' | 'ORGANIZATION' | 'ADMIN' | 'MAINTAINER';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Try to get session from better-auth
      const sessionData = await authClient.getSession();
      
      if (sessionData.data?.session && sessionData.data?.user) {
        setSession(sessionData.data.session);
        setUser({
          id: sessionData.data.user.id,
          email: sessionData.data.user.email,
          name: sessionData.data.user.name || undefined,
          role: sessionData.data.user.role as User['role']
        });
      } else {
        // Clear any stored auth data
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return { success: false, error: result.error.message || 'Login failed' };
      }

      if (result.data?.session && result.data?.user) {
        setSession(result.data.session);
        setUser({
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name || undefined,
          role: result.data.user.role as User['role']
        });
        return { success: true };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if server call fails
      setSession(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
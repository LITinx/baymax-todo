import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Account, ID } from 'react-native-appwrite';
import { client } from '../services/appwrite';

interface User {
  $id: string;
  email: string;
  name: string;
  $createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const account = new Account(client);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = await account.get();
      setUser({
        $id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        $createdAt: currentUser.$createdAt,
      });
    } catch (error) {
      // User is not logged in
      setUser(null);
    } finally {
      setIsAuthInitialized(true);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await account.createEmailPasswordSession({ email, password });
      await checkAuthStatus();
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Create the user account
      await account.create({
        userId: ID.unique(),
        email,
        password,
      });

      // Immediately log them in after registration
      await account.createEmailPasswordSession({ email, password });
      await checkAuthStatus();
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await account.deleteSession('current');
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthInitialized,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

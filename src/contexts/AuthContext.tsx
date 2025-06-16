
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  constituency: string;
  deviceId?: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  ward: string;
  constituency: string;
  deviceId?: string;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('janconnect_token');
    const savedUser = localStorage.getItem('janconnect_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      // Save to localStorage and state
      localStorage.setItem('janconnect_token', data.token);
      localStorage.setItem('janconnect_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      // Save to localStorage and state
      localStorage.setItem('janconnect_token', data.token);
      localStorage.setItem('janconnect_user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('janconnect_token');
    localStorage.removeItem('janconnect_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

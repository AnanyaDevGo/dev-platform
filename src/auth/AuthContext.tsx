import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  startOAuthLogin: () => void;
  completeOAuthLogin: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'dev-portal-auth';

function getStoredUser(): User | null {
  const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  async function login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!email || !password) {
      throw new Error('Please provide your email and password.');
    }
    setUser({ id: 'u-1', email, name: 'Dev User' });
  }

  async function register(name: string, email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!name || !email || !password) {
      throw new Error('All fields are required to create an account.');
    }
    setUser({ id: 'u-2', email, name });
  }

  function logout() {
    setUser(null);
  }

  function startOAuthLogin() {
    window.location.href = '/oauth';
  }

  function completeOAuthLogin() {
    setUser({ id: 'u-oauth', email: 'jane.doe@example.com', name: 'Jane Doe' });
  }

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    startOAuthLogin,
    completeOAuthLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

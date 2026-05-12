import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arias_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('arias_token'));

  useEffect(() => {
    if (user) localStorage.setItem('arias_user', JSON.stringify(user));
    else localStorage.removeItem('arias_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('arias_token', token);
    else localStorage.removeItem('arias_token');
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    isAuthenticated: !!user,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

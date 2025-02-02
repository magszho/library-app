import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string;
  setLoggedIn: (value: boolean) => void;
  setUserEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetch('/auth/status')
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.isLoggedIn);
        setUserEmail(data.email);
      })
      .catch(console.error);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, setLoggedIn, setUserEmail }}>
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
// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('placementHubUser');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) return decoded;
      localStorage.removeItem('placementHubUser');
      return null;
    } catch {
      localStorage.removeItem('placementHubUser');
      return null;
    }
  });

  const login = (token) => {
    localStorage.setItem('placementHubUser', token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('placementHubUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
};
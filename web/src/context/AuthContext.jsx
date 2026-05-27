import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken, getAuthToken } from '../api';
import { setActivePatientId } from '../extras/patientStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const token = getAuthToken();
    if (token) setAuthToken(token);
  }, []);

  function login(userData, token) {
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'customer' && userData.patientId) {
      setActivePatientId(userData.patientId);
    }
    setUser(userData);
  }

  function logout() {
    setAuthToken(null);
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        patientId: user?.patientId || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

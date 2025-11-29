import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth';
import { setAuthToken } from '../api/config';

const AdminAuthContext = createContext(null);

// Admin credentials (hardcoded for now - can be moved to backend)
const ADMIN_EMAIL = 'morslisport97@gmail.com';
const ADMIN_PASSWORD = 'MorsliSport99@T';

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in (has token)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token by getting current user
      getMe()
        .then((userData) => {
          // Only authenticate if user is admin
          if (userData && userData.role === 'admin') {
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Invalid token or not admin, clear it
            setAuthToken(null);
          }
        })
        .catch(() => {
          // Token invalid, clear it
          setAuthToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Try to login with API
      const response = await apiLogin(email, password);
      
      // Check if user is admin (response format: { data: { role, email, ... } })
      const userData = response.data || response;
      if (userData && userData.role === 'admin') {
        setIsAuthenticated(true);
        setUser(userData);
        return { success: true };
      } else {
        setAuthToken(null);
        return { success: false, error: 'Access denied. Admin credentials required.' };
      }
    } catch (error) {
      // If API fails, fallback to hardcoded admin credentials for local development
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminSession', 'authenticated');
        setIsAuthenticated(true);
        setUser({ email, role: 'admin' });
        return { success: true };
      } else {
        return { success: false, error: error.message || 'Invalid email or password' };
      }
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      // Continue logout even if API call fails
    } finally {
      setAuthToken(null);
      localStorage.removeItem('adminSession');
      setIsAuthenticated(false);
      setUser(null);
      // Use window.location for navigation since we're outside Router context
      window.location.href = '/admin/login';
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};


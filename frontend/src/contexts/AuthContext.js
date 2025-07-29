import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Global axios interceptor for 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Check if token is valid on app start
  useEffect(() => {
    const checkAuth = async () => {
      // Don't auto-authenticate if we're on the register page
      if (location.pathname === '/register') {
        console.log('On register page - skipping auto-authentication');
        setLoading(false);
        return;
      }
      
      if (token) {
        try {
          console.log('Checking auth with token:', token);
          const response = await axios.get('http://localhost:8080/profile');
          console.log('Profile response:', response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token, location.pathname]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });
      
      const { token: newToken } = response.data;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      
      // Fetch complete user profile after login
      try {
        const profileResponse = await axios.get('http://localhost:8080/profile');
        setUser(profileResponse.data);
      } catch (profileError) {
        console.error('Failed to fetch user profile:', profileError);
        // Fallback to basic user info
        setUser({ username: response.data.username, email: response.data.email });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://localhost:8080/auth/register', {
        username,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const clearAuthForRegistration = () => {
    console.log('Clearing auth for registration');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    // Force a re-render by updating the token state
    setToken(localStorage.getItem('token'));
  };

  const value = {
    user,
    setUser,
    token,
    isAuthenticated: !!token && location.pathname !== '/register',
    loading,
    login,
    register,
    logout,
    clearAuthForRegistration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
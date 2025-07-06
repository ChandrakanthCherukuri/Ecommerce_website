// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/auth';

// --- IMPORTANT: Set the axios default header immediately on load if token exists ---
// This ensures that any component (like CartContext) trying to make a request
// right after AuthProvider mounts has the token available in the headers.
const storedToken = localStorage.getItem('token');
if (storedToken) {
  axios.defaults.headers.common['x-auth-token'] = storedToken;
}
// ----------------------------------------------------------------------------------

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(storedToken); // Use the immediately checked storedToken
  const [loading, setLoading] = useState(true);

  const setAuthToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['x-auth-token'] = newToken;
      setToken(newToken);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setToken(null);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      setAuthToken(res.data.token);
      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
      setCurrentUser(decoded.user);
      return true;
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setAuthToken(null);
      throw err;
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, { email, password });
      setAuthToken(res.data.token);
      const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
      setCurrentUser(decoded.user);
      return true;
    } catch (err) {
      console.error('Signup error:', err.response ? err.response.data : err.message);
      setAuthToken(null);
      throw err;
    }
  };

  const logout = useCallback(() => {
    setAuthToken(null);
    setCurrentUser(null);
  }, [setAuthToken]);

  useEffect(() => {
    // No need to call setAuthToken(token) again here
    // as axios.defaults.headers.common['x-auth-token'] is already set outside
    // if a token exists, and setAuthToken handles future token changes.

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
            console.log("Token expired, logging out.");
            logout();
        } else {
            setCurrentUser(decoded.user);
        }
      } catch (e) {
        console.error("Invalid token format or expiration check failed:", e);
        logout(); // Logout if token is invalid or corrupted
      }
    }
    setLoading(false); // Set loading to false after initial check
  }, [token, logout]); // Removed setAuthToken from dependencies as it's not strictly needed here anymore for initial setup

  const value = {
    currentUser,
    token, // The current token state
    isAuthenticated: !!currentUser, // Derive isAuthenticated from currentUser
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children if loading is false, preventing content from showing before auth check */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
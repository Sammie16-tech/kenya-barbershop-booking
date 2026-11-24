import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Axios interceptor for automatic authentication
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    checkUserLoggedIn();

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);

      setUser(response.data.user);
    } catch (error) {
      console.error('Auth Check Error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password
    });

    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    router.push('/');
  };

  const register = async (userData) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, userData);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    router.push('/');
  };

  const googleLogin = async (token) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      token
    });

    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

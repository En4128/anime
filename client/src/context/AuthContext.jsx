import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api.js';
import { attachToken } from '../api/client.js';

const STORAGE_KEY = 'animeverse_auth';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: false,
  initializing: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshProfile: async () => {},
});

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to parse auth storage', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [user, setUser] = useState(session?.user ?? null);
  const [token, setToken] = useState(session?.token ?? null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      attachToken(token);
      if (!user) {
        authApi
          .profile()
          .then((res) => setUser(res.data.data))
          .catch(() => logout())
          .finally(() => setInitializing(false));
      } else {
        setInitializing(false);
      }
    } else {
      attachToken(null);
      setInitializing(false);
    }
  }, [token]);

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    const payload = { token: nextToken, user: nextUser };
    setSession(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(payload);
      persist(data.data.token, data.data.user);
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(payload);
      persist(data.data.token, data.data.user);
      return { success: true, user: data.data.user };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    const { data } = await authApi.profile();
    persist(token, data.data);
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    attachToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, token, loading, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


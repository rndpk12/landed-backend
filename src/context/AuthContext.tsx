import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context-value';
import { authApi } from '../services/authApi';
import { TOKEN_KEY } from '../lib/apiClient';
import type { LoginCredentials, RegisterPayload } from '../types/auth';
import type { User } from '../types/user';

const hasStoredToken = () => Boolean(localStorage.getItem(TOKEN_KEY));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasStoredToken);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      authApi.saveToken(response.token);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await authApi.register(payload);
      authApi.saveToken(response.token);
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.clearToken();
    localStorage.removeItem('landed.user');
    setUser(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      authApi.clearToken();
      localStorage.removeItem('landed.user');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = useCallback(() => Boolean(hasStoredToken() && user), [user]);

  useEffect(() => {
    localStorage.removeItem('landed.user');

    if (hasStoredToken()) {
      void getCurrentUser();
    } else {
      setLoading(false);
    }
  }, [getCurrentUser]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, getCurrentUser, isAuthenticated }),
    [user, loading, login, register, logout, getCurrentUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginApi, register as registerApi, type RegisterPayload } from '../api/auth';
import { clearToken, getToken, isAuthenticated, setToken } from '../utils/token';

interface AuthContextValue {
  authenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    setToken(response.accessToken);
    setAuthenticated(true);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await registerApi(payload);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      authenticated: authenticated && Boolean(getToken()),
      login,
      register,
      logout,
    }),
    [authenticated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

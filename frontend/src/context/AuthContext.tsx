// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import authService, { type User as AuthUser } from "../services/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const parseProfileResponse = (payload: any): AuthUser | null => {
    // backend sometimes returns { user } or { user: {...} } or user directly
    if (!payload) return null;
    if (payload.user) return payload.user as AuthUser;
    if (payload.data && payload.data.user) return payload.data.user as AuthUser;
    if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data))
      return payload.data as AuthUser;
    return (payload as AuthUser) ?? null;
  };

  const refreshProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await authService.profile();
      const parsed = parseProfileResponse(res); // authService.profile returns various shapes
      setUser(parsed);
    } catch (err) {
      // if token invalid or no profile, make sure session cleared
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      try {
        await refreshProfile();
      } catch {
        // ignore
      }
    };
    init();

    // allow listening to cross-tab logout
    const handleExternalLogout = () => {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    };
    window.addEventListener("auth:logout", handleExternalLogout);

    return () => {
      mounted = false;
      window.removeEventListener("auth:logout", handleExternalLogout);
    };
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const res = await authService.login({ email, password });
        // authService sets token & user in local storage on success
        // refresh profile to get canonical user data
        await refreshProfile();
        // navigate to home/dashboard after login
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [refreshProfile, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:logout"));
      setUser(null);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

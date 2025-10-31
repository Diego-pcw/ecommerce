// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import type { User as AuthUser } from "../types/User";

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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const user = await authService.profile();
      setUser(user);
    } catch {
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
      await refreshProfile();
    };
    init();

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
        await authService.login({ email, password });
        await refreshProfile();
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

import React,
  { createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo
  } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { useCarritoContext } from "./CarritoContext";
import type { User as AuthUser } from "../types/User";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🛒 Integración con carrito
  const { obtenerCarrito, vaciarCarrito } = useCarritoContext();

  /** 🔹 Refrescar perfil */
  const refreshProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const userData = await authService.profile();
      setUser(userData);
    } catch {
      // Token inválido → limpiar sesión
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 Inicializar sesión al cargar la app */
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

    // 🔸 Logout sincronizado entre pestañas
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

  /** 🔹 Login */
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        await authService.login({ email, password });

        await refreshProfile();
        await obtenerCarrito();

        navigate("/", { replace: true });
      } catch (error) {
        console.error("❌ Error en login:", error);
      } finally {
        setLoading(false);
      }
    },
    [refreshProfile, obtenerCarrito, navigate]
  );

  /** 🔹 Logout */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      console.warn("⚠️ Logout remoto falló. Limpiando sesión local...");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(new Event("auth:logout"));

      setUser(null);
      await vaciarCarrito();
      navigate("/login", { replace: true });
    }
  }, [navigate, vaciarCarrito]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshProfile,
    }),
    [user, loading, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** 🎯 Hook */
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};

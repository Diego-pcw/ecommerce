// src/services/api.ts
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";

/**
 * Configuración principal de Axios para toda la aplicación.
 * Únicamente usa Bearer Token — sin cookies, sin withCredentials.
 */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://mediumspringgreen-koala-465676.hostingersite.com/api";

// 🔹 Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 segundos
});

// =========================================================
// 🧩 INTERCEPTOR DE REQUEST
// =========================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Error en solicitud:", error);
    return Promise.reject(error);
  }
);

// =========================================================
// 🧩 INTERCEPTOR DE RESPONSE
// =========================================================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("⚠️ Token expirado o inválido. Cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      if (status === 403) console.error("🚫 Acceso denegado.");
      if (status === 404) console.warn("📭 Recurso no encontrado.");
      if (status >= 500) console.error("💥 Error interno del servidor:", error.response);
    } else if (error.request) {
      console.error("🌐 Sin respuesta del servidor:", error.request);
    } else {
      console.error("⚠️ Error desconocido:", error.message);
    }

    return Promise.reject(error);
  }
);

// =========================================================
// 🧩 MÉTODOS AUXILIARES
// =========================================================
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getBaseUrl = (): string => BASE_URL;

export default api;

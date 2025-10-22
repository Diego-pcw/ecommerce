//configuración base de Axios (token, baseURL, interceptores).
//Es el núcleo sobre el que se apoyan todos los demás servicios.
// src/services/api.ts
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";

/**
 * Configuración principal de Axios para toda la aplicación.
 * Maneja:
 * - Base URL global
 * - Token JWT (si existe)
 * - Interceptores de request/response
 * - Errores centralizados
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Si hay respuesta del servidor
    if (error.response) {
      const status = error.response.status;

      // 🔸 Token expirado → cerrar sesión automáticamente
      if (status === 401) {
        console.warn("⚠️ Token expirado o inválido. Cerrando sesión...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirige solo si estás en entorno navegador
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // 🔸 Errores 403 (acceso denegado)
      if (status === 403) {
        console.error("🚫 Acceso denegado.");
      }

      // 🔸 Errores 404
      if (status === 404) {
        console.warn("📭 Recurso no encontrado.");
      }

      // 🔸 Otros errores del servidor
      if (status >= 500) {
        console.error("💥 Error interno del servidor:", error.response);
      }
    } else if (error.request) {
      // Sin respuesta del servidor
      console.error("🌐 Sin respuesta del servidor:", error.request);
    } else {
      // Error desconocido
      console.error("⚠️ Error desconocido:", error.message);
    }

    return Promise.reject(error);
  }
);

// =========================================================
// 🧩 MÉTODOS AUXILIARES
// =========================================================

/**
 * Establece el token manualmente (por ejemplo, tras iniciar sesión).
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * Obtiene la URL base del backend actual.
 */
export const getBaseUrl = (): string => BASE_URL;

// =========================================================
// 🧩 EXPORTACIÓN PRINCIPAL
// =========================================================

export default api;

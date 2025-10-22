//auth.service.ts → login, registro, logout, perfil (porque User es la base del resto).
// src/services/auth.service.ts
import api, { setAuthToken } from "./api";
import { type AxiosResponse } from "axios";

export interface User {
  id: number;
  name: string; // ✅ en el backend el campo es "name", no "nombre"
  email: string;
  rol: "admin" | "cliente";
  estado: "activo" | "inactivo";
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  /** 🔹 Registro */
  async register(data: RegisterData): Promise<AuthResponse> {
    const res: AxiosResponse<AuthResponse> = await api.post("/register", data);
    if (res.data.token) this.setSession(res.data);
    return res.data;
  }

  /** 🔹 Login */
  async login(data: LoginData): Promise<AuthResponse> {
    const res: AxiosResponse<AuthResponse> = await api.post("/login", data);
    if (res.data.token) this.setSession(res.data);
    return res.data;
  }

  /** 🔹 Logout */
  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } finally {
      this.clearSession();
    }
  }

  /** 🔹 Perfil del usuario autenticado */
  async profile(): Promise<User> {
    const res: AxiosResponse<{ user: User }> = await api.get("/profile");
    return res.data.user;
  }

  /** 🔹 Actualizar perfil (nombre o contraseña) */
  async updateProfile(data: {
    name?: string;
    password?: string;
    password_confirmation?: string;
  }): Promise<User> {
    const res: AxiosResponse<{ user: User }> = await api.put(
      "/usuario/actualizar",
      data
    );
    return res.data.user;
  }

  /** 🔹 ADMIN: Listar usuarios */
  async getUsuarios(params?: {
    buscar?: string;
    estado?: string;
    rol?: "admin" | "cliente";
    orden?: "asc" | "desc";
    per_page?: number;
    page?: number;
  }): Promise<{ usuarios: User[]; total: number }> {
    const res: AxiosResponse<any> = await api.get("/usuarios", { params });
    return {
      usuarios: res.data.usuarios.data,
      total: res.data.total,
    };
  }

  /** 🔹 ADMIN: Cambiar estado del usuario (toggle activo/inactivo) */
  async cambiarEstadoUsuario(id: number): Promise<User> {
    const res: AxiosResponse<{ user: User }> = await api.put(
      `/usuarios/${id}/estado`
    );
    return res.data.user;
  }

  // =====================================================
  // 🧩 GESTIÓN LOCAL DE SESIÓN
  // =====================================================

  private setSession(auth: AuthResponse): void {
    localStorage.setItem("token", auth.token);
    localStorage.setItem("user", JSON.stringify(auth.user));
    setAuthToken(auth.token);
  }

  private clearSession(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}

export default new AuthService();


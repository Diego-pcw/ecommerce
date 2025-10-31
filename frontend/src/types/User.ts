// src/types/User.ts
import { type Paginated } from "./Common";

/**
 * 🔹 Representa a un usuario del sistema.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  rol: "admin" | "cliente";
  estado: "activo" | "inactivo";
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** 🔹 Datos enviados en el formulario de registro */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/** 🔹 Datos enviados en el formulario de login */
export interface LoginData {
  email: string;
  password: string;
}

/** 🔹 Respuesta al registrar o iniciar sesión */
export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

/** 🔹 Respuesta al obtener el perfil autenticado */
export interface ProfileResponse {
  user: User;
}

/** 🔹 Respuesta del endpoint de usuarios (solo admin) */
export interface UserListResponse {
  message: string;
  total: number;
  usuarios: Paginated<User>;
}

/** 🔹 Cuerpo para actualizar perfil */
export interface UpdateProfileData {
  name?: string;
  password?: string;
  password_confirmation?: string;
}

/** 🔹 Respuesta al cambiar estado */
export interface ChangeUserStateResponse {
  message: string;
  user: User;
}

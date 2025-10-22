// src/types/User.ts

import { type Paginated } from './Common'

/**
 * 🔹 Representa a un usuario del sistema.
 * Incluye información personal, estado y rol.
 */
export interface User {
  id: number
  name: string
  email: string
  rol: 'admin' | 'cliente'
  estado: 'activo' | 'inactivo'
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * 🔹 Datos enviados en el formulario de registro de usuario.
 */
export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

/**
 * 🔹 Datos enviados en el formulario de inicio de sesión.
 */
export interface LoginData {
  email: string
  password: string
}

/**
 * 🔹 Respuesta JSON del registro o login exitoso.
 */
export interface AuthResponse {
  message: string
  user: User
  token: string
}

/**
 * 🔹 Respuesta de la API al obtener el perfil autenticado.
 */
export interface ProfileResponse {
  user: User
}

/**
 * 🔹 Respuesta de la API al listar usuarios (solo admin)
 */
export interface UserListResponse {
  message: string
  total: number
  usuarios: Paginated<User>
}

/**
 * 🔹 Cuerpo de solicitud para actualizar perfil.
 */
export interface UpdateProfileData {
  name?: string
  password?: string
  password_confirmation?: string
}

/**
 * 🔹 Respuesta genérica al cambiar el estado del usuario.
 */
export interface ChangeUserStateResponse {
  message: string
  user: User
}

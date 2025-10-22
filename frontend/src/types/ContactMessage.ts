import { type User } from "./User";

/**
 * Representa un mensaje de contacto enviado por un usuario
 * (a través del formulario de contacto del sitio).
 */
export interface ContactMessage {
  id: number;
  user_id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;

  /** Medio preferido para la respuesta */
  canal_preferido: "EMAIL" | "WHATSAPP" | "TELEFONO";

  /** Estado del mensaje */
  estado: "NUEVO" | "RESPONDIDO" | "CERRADO" | "PENDIENTE";

  respuesta?: string | null;
  fecha_respuesta?: string | null;

  /** Relación con usuario */
  user?: User;

  created_at?: string;
  updated_at?: string;
}

/**
 * Datos enviados al crear un mensaje de contacto.
 */
export interface ContactMessageCreateData {
  mensaje: string;
  telefono?: string | null;
  canal_preferido?: "EMAIL" | "WHATSAPP" | "TELEFONO";
}

/**
 * Datos enviados al responder o actualizar un mensaje (solo admin).
 */
export interface ContactMessageUpdateData {
  estado?: "NUEVO" | "RESPONDIDO" | "CERRADO" | "PENDIENTE";
  respuesta?: string | null;
}

/**
 * Estructura de respuesta al crear o actualizar mensaje.
 */
export interface ContactMessageResponse {
  message: string;
  data: ContactMessage;
}

/**
 * Estructura de respuesta paginada.
 */
export interface ContactMessageIndexResponse {
  total: number;
  current_page: number;
  last_page: number;
  data: ContactMessage[];
}

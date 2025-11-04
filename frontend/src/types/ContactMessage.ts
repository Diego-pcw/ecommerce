import { type User } from "./User";

/** Representa un mensaje de contacto enviado por un usuario */
export interface ContactMessage {
  id: number;
  user_id?: number | null;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;

  /** Medio preferido para la respuesta */
  canal_preferido: "EMAIL" | "WHATSAPP" | "TELEFONO";

  /** Estado actual del mensaje */
  estado: "NUEVO" | "RESPONDIDO" | "CERRADO" | "PENDIENTE";

  respuesta?: string | null;
  fecha_respuesta?: string | null;

  /** Relaciones opcionales */
  user?: User;

  created_at?: string;
  updated_at?: string;
}

/** Datos enviados al crear un nuevo mensaje */
export interface ContactMessageCreateData {
  mensaje: string;
  telefono?: string | null;
  canal_preferido?: "EMAIL" | "WHATSAPP" | "TELEFONO";
}

/** Datos enviados al actualizar o responder un mensaje */
export interface ContactMessageUpdateData {
  estado?: "NUEVO" | "RESPONDIDO" | "CERRADO" | "PENDIENTE";
  respuesta?: string | null;
}

/** Estructura de respuesta estándar */
export interface ContactMessageResponse {
  message: string;
  data: ContactMessage;
}

/** Estructura paginada */
export interface ContactMessageIndexResponse {
  total: number;
  current_page: number;
  last_page: number;
  data: ContactMessage[];
}

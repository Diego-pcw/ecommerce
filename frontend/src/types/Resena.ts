import { type User } from "./User";
import { type Producto } from "./Producto";

/**
 * Representa una reseña o calificación de un producto.
 */
export interface Resena {
  id: number;
  user_id: number;
  producto_id: number;
  rating: number; // Calificación (1 a 5)
  titulo?: string | null;
  comentario: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";

  /** Relaciones opcionales */
  user?: User;
  producto?: Producto;

  created_at?: string;
  updated_at?: string;
}

/**
 * Datos enviados al crear una nueva reseña.
 */
export interface ResenaCreateData {
  producto_id: number;
  rating: number;
  titulo?: string | null;
  comentario: string;
}

/**
 * Datos enviados al actualizar una reseña.
 */
export interface ResenaUpdateData {
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  titulo?: string | null;
  comentario?: string;
  rating?: number;
}

/**
 * Estructura estándar de respuesta para creación o actualización.
 */
export interface ResenaResponse {
  message: string;
  data: Resena;
}

/**
 * Estructura paginada para listar reseñas.
 */
export interface ResenaIndexResponse {
  total: number;
  current_page: number;
  last_page: number;
  data: Resena[];
}

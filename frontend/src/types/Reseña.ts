import { type User } from "./User";
import { type Producto } from "./Producto";

/**
 * Representa una reseña o calificación de un producto.
 */
export interface Reseña {
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
export interface ReseñaCreateData {
  producto_id: number;
  rating: number;
  titulo?: string | null;
  comentario: string;
}

/**
 * Datos enviados al actualizar una reseña.
 * (Solo accesible por admin/moderador o propietario según caso)
 */
export interface ReseñaUpdateData {
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  titulo?: string | null;
  comentario?: string;
  rating?: number;
}

/**
 * Estructura estándar de respuesta para creación o actualización.
 */
export interface ReseñaResponse {
  message: string;
  data: Reseña;
}

/**
 * Estructura paginada para listar reseñas.
 */
export interface ReseñaIndexResponse {
  total: number;
  current_page: number;
  last_page: number;
  data: Reseña[];
}

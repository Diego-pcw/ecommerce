// src/types/ProductoPromocion.ts

/**
 * 🔹 Representa la tabla pivote entre productos y promociones (relación N:M).
 *
 * ⚠️ Nota:
 * Este tipo rara vez se usa directamente en el frontend,
 * ya que Laravel suele devolver esta información dentro del campo `pivot`
 * en las relaciones `belongsToMany`.
 *
 * Solo es útil si haces consultas directas a esta tabla.
 */
export interface ProductoPromocion {
  id: number;
  producto_id: number;
  promocion_id: number;
  created_at?: string | null;
  updated_at?: string | null;
}

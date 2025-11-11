// =========================================================
// 📘 Types: Promocion
// =========================================================

export interface Promocion {
  id: number;
  titulo: string;
  descripcion: string | null;
  descuento_tipo: "percent" | "fixed";
  descuento_valor: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "activo" | "inactivo";
  productos?: PromocionProducto[];
  created_at?: string;
  updated_at?: string;
  pivot?: {
    producto_id: number;
    promocion_id: number;
  };
}

/**
 * 🔹 Relación de productos asignados a una promoción
 */
export interface PromocionProducto {
  id: number;
  nombre: string;
  precio: number | string;
  categoria_id: number;
  categoria_nombre?: string;
  estado: "ACTIVO" | "INACTIVO";
  precio_con_descuento?: number;
}

/**
 * 🔸 Datos para crear una nueva promoción
 */
export interface PromocionCreateData {
  titulo: string;
  descripcion?: string;
  descuento_tipo: "percent" | "fixed";
  descuento_valor: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: "activo" | "inactivo";
}

/**
 * 🔸 Datos para actualizar una promoción existente
 */
export interface PromocionUpdateData extends Partial<PromocionCreateData> {
  
}

/**
 * 🔸 Datos para asignar productos a una promoción
 */
export interface AsignarProductosData {
  productos: number[];
}

/**
 * 🔹 Respuesta de creación/actualización de promoción
 */
export interface PromocionResponse {
  message: string;
  promocion: Promocion;
}

/**
 * 🔹 Respuesta de asignación de productos
 */
export interface AsignarProductosResponse {
  message: string;
  promocion: Promocion;
}

/**
 * 🔹 Respuesta al listar promociones
 */
export interface PromocionListResponse {
  total: number;
  data: Promocion[];
}

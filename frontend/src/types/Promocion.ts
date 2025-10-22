// src/types/Promocion.ts

import { type Paginated } from "./Common";

/**
 * 🔹 Producto simplificado cuando se devuelve junto a una promoción.
 * Incluye los campos necesarios del modelo Producto.
 */
export interface PromocionProducto {
  id: number;
  nombre: string;
  precio: number;

  /** Información proveniente de la tabla pivote (producto_promocion) */
  pivot?: {
    promocion_id: number;
    producto_id: number;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

/**
 * 🔹 Representa una promoción activa o inactiva aplicada a uno o varios productos.
 * Incluye descuentos por valor fijo o porcentual.
 */
export interface Promocion {
  id: number;

  /** Título en mayúsculas de la promoción (ej. "PROMOCIÓN DE INVIERNO") */
  titulo: string;

  /** Descripción opcional en mayúsculas */
  descripcion?: string | null;

  /** Tipo de descuento: porcentaje (%) o valor fijo */
  descuento_tipo: "percent" | "fixed";

  /** Valor numérico del descuento (según tipo) */
  descuento_valor: number;

  /** Fecha de inicio (YYYY-MM-DD) */
  fecha_inicio: string;

  /** Fecha de fin (YYYY-MM-DD) */
  fecha_fin: string;

  /** Estado actual de la promoción */
  estado: "activo" | "inactivo";

  /** Productos asociados a esta promoción (si se carga con with()) */
  productos?: PromocionProducto[];

  /** Campo calculado: indica si está vigente actualmente (no siempre presente) */
  esta_vigente?: boolean;

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 🔸 Datos enviados al crear una nueva promoción.
 */
export interface PromocionCreateData {
  titulo: string;
  descripcion?: string | null;
  descuento_tipo: "percent" | "fixed";
  descuento_valor: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  estado?: "activo" | "inactivo";
}

/**
 * 🔸 Datos enviados al actualizar una promoción existente.
 */
export interface PromocionUpdateData {
  titulo?: string;
  descripcion?: string | null;
  descuento_tipo?: "percent" | "fixed";
  descuento_valor?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: "activo" | "inactivo";
}

/**
 * 🔸 Datos enviados al asignar productos a una promoción.
 */
export interface AsignarProductosData {
  productos: number[]; // IDs de productos
}

/**
 * ✅ Respuesta al crear o actualizar una promoción.
 */
export interface PromocionResponse {
  message: string;
  promocion: Promocion;
}

/**
 * ✅ Respuesta al asignar productos a una promoción.
 */
export interface AsignarProductosResponse {
  message: string;
  promocion: Promocion;
}

/**
 * ✅ Respuesta del endpoint index() → lista paginada de promociones.
 */
export interface PromocionListResponse extends Paginated<Promocion> {}

// src/types/CarritoDetalle.ts

import { type Producto } from "./Producto";

/**
 * 🔹 Detalle individual dentro de un carrito.
 * Contiene un producto, su cantidad y el precio unitario registrado.
 */
export interface CarritoDetalle {
  id: number;
  carrito_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  producto?: Producto;

  /** Nuevo campo para mostrar precio original tachado */
  precio_original?: number;

  created_at?: string | null;
  updated_at?: string | null;
}
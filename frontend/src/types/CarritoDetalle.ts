// src/types/CarritoDetalle.ts

import { type Producto } from "./Producto";

/**
 * 🔹 Detalle individual dentro de un carrito.
 * Contiene un producto, su cantidad y el precio unitario registrado.
 */
export interface CarritoDetalle {
  id: number;

  /** ID del carrito al que pertenece */
  carrito_id: number;

  /** ID del producto agregado */
  producto_id: number;

  /** Cantidad de unidades agregadas */
  cantidad: number;

  /** Precio unitario al momento de agregar el producto */
  precio_unitario: number;

  /** Subtotal calculado (cantidad × precio_unitario) */
  subtotal?: number;

  /** Producto completo (si se carga con with('producto')) */
  producto?: Producto;

  created_at?: string | null;
  updated_at?: string | null;
}

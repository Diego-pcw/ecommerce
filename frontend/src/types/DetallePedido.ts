// src/types/DetallePedido.ts

import { type Producto } from "./Producto";

/**
 * 🔹 Detalle individual dentro de un pedido.
 * Representa un producto comprado, su cantidad y precio unitario.
 */
export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;

  /**
   * Subtotal calculado (cantidad × precio_unitario).
   * Si el backend no lo envía, se puede calcular en el frontend.
   */
  subtotal?: number;

  /** Objeto del producto (si se carga con with('producto')) */
  producto?: Producto;

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 🔸 Datos enviados al agregar un producto a un pedido existente (solo admin).
 */
export interface DetallePedidoCreateData {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

/**
 * 🔸 Datos enviados al actualizar un detalle de pedido (solo admin).
 */
export interface DetallePedidoUpdateData {
  cantidad?: number;
  precio_unitario?: number;
}

/**
 * ✅ Respuesta al crear un detalle de pedido.
 */
export interface DetallePedidoCreateResponse {
  message: string;
  data: DetallePedido;
}

/**
 * ✅ Respuesta al actualizar un detalle de pedido.
 */
export interface DetallePedidoUpdateResponse {
  message: string;
  data: DetallePedido;
}

/**
 * ✅ Respuesta al eliminar un detalle de pedido.
 */
export interface DetallePedidoDeleteResponse {
  message: string;
}

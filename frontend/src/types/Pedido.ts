// src/types/Pedido.ts

import { type DetallePedido } from "./DetallePedido";
import { type User } from "./User";

/**
 * 🔹 Representa un pedido realizado por un usuario.
 * Incluye dirección de envío, método de pago y sus detalles.
 */
export interface Pedido {
  id: number;
  user_id: number;

  /** Estado del pedido (siempre en MAYÚSCULAS) */
  estado: "PENDIENTE" | "PAGADO" | "ENVIADO" | "CANCELADO" | "ENTREGADO";

  /** Fecha en que se realizó el pedido */
  fecha_pedido?: string | null;

  /** Total del pedido (sumatoria de los detalles) */
  total: number;

  /** Método de pago (ejemplo: TARJETA, TRANSFERENCIA, EFECTIVO, etc.) */
  payment_method?: string | null;

  /** Dirección de envío (cada valor en MAYÚSCULAS) */
  shipping_address?: Record<string, string> | null;

  /** ID de transacción o referencia de pago (en MAYÚSCULAS) */
  transaction_id?: string | null;

  /** Fecha de confirmación de pago (solo si estado = PAGADO) */
  paid_at?: string | null;

  /** Relación con el usuario (si se carga con with()) */
  user?: User;

  /** Detalles del pedido (si se carga con with()) */
  detalles?: DetallePedido[];

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 🔸 Estructura de un ítem al crear un pedido.
 */
export interface PedidoItem {
  producto_id: number;
  cantidad: number;
  /** Opcional: precio manual, si no se especifica usa el precio del producto. */
  precio_unitario?: number;
}

/**
 * 🔸 Datos enviados al crear un nuevo pedido.
 */
export interface PedidoCreateData {
  shipping_address: Record<string, string>;
  payment_method: string;
  items: PedidoItem[];
}

/**
 * 🔸 Datos enviados al actualizar el estado de un pedido (solo admin).
 */
export interface PedidoUpdateData {
  estado: "PENDIENTE" | "PAGADO" | "ENVIADO" | "CANCELADO" | "ENTREGADO";
}

/**
 * ✅ Respuesta al crear un pedido.
 */
export interface PedidoCreateResponse {
  message: string;
  data: Pedido;
}

/**
 * ✅ Respuesta al actualizar un pedido.
 */
export interface PedidoUpdateResponse {
  message: string;
  data: Pedido;
}

/**
 * ✅ Respuesta del endpoint index() → lista paginada de pedidos.
 * Adaptado exactamente a la estructura que devuelve Laravel.
 */
export interface PedidoIndexResponse {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
  data: Pedido[];
}

/**
 * ✅ Respuesta del endpoint show() → pedido individual con detalles.
 */
export interface PedidoShowResponse extends Pedido {}

/**
 * ✅ Respuesta al eliminar un pedido.
 */
export interface PedidoDeleteResponse {
  message: string;
}

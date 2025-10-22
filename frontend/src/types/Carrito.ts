// src/types/Carrito.ts

import { type CarritoDetalle } from "./CarritoDetalle";
import { type User } from "./User";
import { type Paginated } from "./Common";

/**
 * 🔹 Representa un carrito de compras activo, expirado o vacío.
 * Puede pertenecer a un usuario autenticado o a una sesión invitada.
 */
export interface Carrito {
  id: number;

  /** ID del usuario propietario (si está autenticado) */
  user_id?: number | null;

  /** Identificador de sesión para carritos de invitados */
  session_id?: string | null;

  /** Estado del carrito: puede cambiar dinámicamente por expiración */
  estado: "activo" | "expirado";

  /** Fecha de expiración automática del carrito */
  expires_at?: string | null;

  /** Relación con usuario (si se carga con with()) */
  usuario?: User | null;

  /** Lista de productos agregados al carrito (si se carga con with()) */
  detalles?: CarritoDetalle[];

  /** Indica si el carrito está vacío (propiedad accesora) */
  esta_vacio?: boolean;

  /** Total general del carrito (propiedad accesora) */
  total?: number;

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 🔸 Datos enviados para agregar un producto al carrito.
 */
export interface AgregarProductoData {
  producto_id: number;
  cantidad?: number; // Default: 1
}

/**
 * 🔸 Datos enviados para actualizar la cantidad de un producto.
 * Si cantidad = 0 → el producto se elimina.
 */
export interface ActualizarCantidadData {
  producto_id: number;
  cantidad: number;
}

/**
 * ✅ Respuesta al obtener o crear carrito (obtenerCarrito / agregarProducto).
 */
export interface CarritoResponse {
  session_id: string | null;
  carrito: Carrito;
  message?: string; // Solo presente al agregar producto
}

/**
 * ✅ Respuesta al mostrar un carrito con totales (mostrar).
 */
export interface CarritoMostrarResponse {
  carrito: Carrito;
  total: number;
  esta_vacio: boolean;
}

/**
 * ✅ Respuesta al actualizar la cantidad de un producto en el carrito.
 */
export interface ActualizarCantidadResponse {
  message: string;
  detalle: CarritoDetalle | null;
}

/**
 * 🔸 Resumen estadístico de carritos (para vista de administrador).
 */
export interface CarritoResumen {
  total: number;
  activos: number;
  expirados: number;
  vacios: number;
}

/**
 * 🔸 Filtros aplicados en el listado de carritos (index admin).
 */
export interface CarritoFiltros {
  estado?: string | null;
  sessionId?: string | null;
  userId?: number | null;
}

/**
 * 🔸 Información de ordenamiento aplicada al listado de carritos (index admin).
 */
export interface CarritoOrden {
  campo: string;
  direccion: "asc" | "desc";
}

/**
 * ✅ Respuesta del endpoint index() → lista paginada (solo admin).
 */
export interface CarritoIndexResponse {
  filtros: CarritoFiltros;
  resumen: CarritoResumen;
  orden: CarritoOrden;
  carritos: Paginated<Carrito>;
}

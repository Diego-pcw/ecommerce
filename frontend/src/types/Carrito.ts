// src/types/Carrito.ts
import { type CarritoDetalle } from "./CarritoDetalle";
import { type User } from "./User";
import { type Paginated } from "./Common";

/**
 * 🔹 Representa un carrito de compras (activo, expirado o vacío)
 * Puede pertenecer a un usuario autenticado o a una sesión invitada.
 */
export interface Carrito {
  id: number;
  user_id?: number | null;
  session_id?: string | null;
  estado: "activo" | "expirado";
  expires_at?: string | null;

  usuario?: User | null;
  detalles?: CarritoDetalle[];

  /** Propiedades accesoras */
  esta_vacio?: boolean;
  total?: number;

  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * 🔸 Datos enviados para agregar un producto al carrito.
 */
export interface AgregarProductoData {
  producto_id: number;
  cantidad?: number; // Por defecto: 1
}

/**
 * 🔸 Datos enviados para actualizar la cantidad de un producto.
 */
export interface ActualizarCantidadData {
  producto_id: number;
  cantidad: number;
}

/**
 * ✅ Respuesta al obtener carrito (GET /api/carrito)
 */
export interface CarritoObtenerResponse {
  session_id: string | null;
  carrito: Carrito;
}

/**
 * ✅ Respuesta al agregar producto (POST /api/carrito/agregar)
 */
export interface CarritoAgregarResponse {
  message: string;
  session_id: string | null;
  carrito: Carrito;
}

/**
 * ✅ Respuesta al mostrar carrito con total (GET /api/carrito/{id})
 */
export interface CarritoMostrarResponse {
  carrito: Carrito;
  total: number;
  esta_vacio: boolean;
}

/**
 * ✅ Respuesta al actualizar cantidad (PUT /api/carrito/{id}/actualizar)
 */
export interface CarritoActualizarResponse {
  message: string;
  detalle: CarritoDetalle;
}

/**
 * ✅ Respuesta al eliminar producto o vaciar carrito
 */
export interface CarritoEliminarResponse {
  message: string;
}

/**
 * 🔸 Resumen estadístico para la vista de administrador
 */
export interface CarritoResumen {
  total: number;
  activos: number;
  expirados: number;
  vacios: number;
  fusionados?: number; // ✅ Agregado
}

/**
 * 🔸 Filtros aplicados al listado de carritos (solo admin)
 */
export interface CarritoFiltros {
  estado?: string | null;
  sessionId?: string | null;
  userId?: number | null;
}

/**
 * 🔸 Orden aplicado al listado de carritos (solo admin)
 */
export interface CarritoOrden {
  campo: string;
  direccion: "asc" | "desc";
}

/**
 * ✅ Respuesta del endpoint GET /api/carritos (index admin)
 */
export interface CarritoIndexResponse {
  filtros: CarritoFiltros;
  resumen: CarritoResumen;
  orden: CarritoOrden;
  carritos: Paginated<Carrito>;
}

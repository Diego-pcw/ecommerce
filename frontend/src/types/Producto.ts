// src/types/Producto.ts

import { type Categoria } from './Categoria'
import { type ImagenProducto } from './ImagenProducto'
import { type Paginated, type DataResponse } from './Common'

/**
 * 🔹 Representa una promoción vigente aplicada a un producto.
 * Devuelta por el accessor `getPromocionVigenteAttribute` del modelo.
 */
export interface PromocionVigente {
  titulo: string
  tipo: 'percent' | 'fixed'
  valor: number
  fecha_inicio: string
  fecha_fin: string
}

/**
 * 🔹 Imagen simplificada para listados (index, show, ofertas).
 */
export interface ProductoImagen {
  id: number
  url: string
  principal: boolean
}

/**
 * 🔹 Representa un producto completo según el modelo de Laravel.
 * Incluye relaciones opcionales y atributos calculados.
 */
export interface Producto {
  id: number
  categoria_id: number
  nombre: string
  slug?: string
  descripcion?: string | null
  precio: number
  stock: number
  sku?: string | null
  estado?: 'activo' | 'inactivo'
  deleted_at?: string | null

  /** Relación con categoría (objeto completo si se carga con with()) */
  categoria?: Categoria

  /** Relación con imágenes (colección completa si se carga con with()) */
  imagenes?: ImagenProducto[]

  /** Precio final calculado con descuento (accessor del modelo) */
  precio_con_descuento?: number

  /** Promoción vigente (accessor del modelo) */
  promocion_vigente?: PromocionVigente | null

  created_at?: string | null
  updated_at?: string | null
}

/**
 * 🔹 Versión del producto usada en listados o vistas públicas (index, show, productosConOfertas).
 * Es el formato real que devuelve el controlador transformado en JSON.
 */
export interface ProductoListItem {
  id: number
  nombre: string
  descripcion?: string | null
  categoria: string | null // nombre de categoría (no objeto)
  precio_original: number
  precio_final: number
  stock: number
  promocion_vigente: PromocionVigente | null
  imagenes: ProductoImagen[]
}

/**
 * 🔹 Datos enviados para crear un nuevo producto.
 */
export interface ProductoCreateData {
  nombre: string
  descripcion?: string | null
  precio: number
  stock: number
  categoria_id: number
  sku?: string
  estado?: 'activo' | 'inactivo'
}

/**
 * 🔹 Datos enviados para actualizar un producto existente.
 */
export interface ProductoUpdateData {
  nombre?: string
  descripcion?: string | null
  precio?: number
  stock?: number
  categoria_id?: number
  sku?: string
  estado?: 'activo' | 'inactivo'
}

/**
 * 🔹 Respuesta al crear o actualizar un producto.
 * Ejemplo:
 * {
 *   "message": "✅ Producto creado correctamente",
 *   "producto": { ... }
 * }
 */
export interface ProductoResponse extends DataResponse<Producto> {}

/**
 * 🔹 Respuesta del endpoint index() → lista paginada de productos.
 * Compatible con Laravel paginate().
 */
export interface ProductoListResponse extends Paginated<ProductoListItem> {}

/**
 * 🔹 Respuesta del endpoint productosConOfertas() → array simple sin paginación.
 */
export type ProductosOfertasResponse = ProductoListItem[]

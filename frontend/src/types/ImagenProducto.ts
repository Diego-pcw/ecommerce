// src/types/ImagenProducto.ts

import { type Producto } from './Producto'
import { type DataResponse } from './Common'

/**
 * 🔹 Representa una imagen completa registrada en la base de datos.
 * Incluye todos los campos persistidos y calculados por el modelo.
 */
export interface ImagenProducto {
  id: number
  producto_id: number

  /** Ruta interna del archivo en storage */
  path: string

  /** Texto alternativo (accesibilidad y SEO) */
  alt_text?: string | null

  /** Indica si es la imagen principal del producto */
  principal: boolean

  /** Orden de visualización */
  orden: number

  /** Estado en base de datos (guardado en mayúsculas) */
  estado: 'ACTIVO' | 'INACTIVO'

  /** URL pública generada automáticamente por el modelo */
  url: string

  /** Relación con producto (si se carga con with()) */
  producto?: Producto

  created_at?: string | null
  updated_at?: string | null
}

/**
 * 🔹 Imagen simplificada para listados o vistas rápidas.
 */
export interface ImagenProductoSimple {
  id: number
  url: string
  alt_text?: string | null
}

/**
 * 🔸 Datos enviados al crear una nueva imagen.
 * Debe enviarse como formulario multipart/form-data.
 */
export interface ImagenProductoCreateData {
  producto_id: number
  imagen: File
  alt_text?: string | null
  principal?: boolean
  orden?: number
}

/**
 * 🔸 Datos enviados al actualizar una imagen existente.
 * También se envía como multipart/form-data si incluye un nuevo archivo.
 */
export interface ImagenProductoUpdateData {
  imagen?: File
  alt_text?: string | null
  principal?: boolean
  orden?: number
  /** Estado en minúsculas (para validación backend) */
  estado?: 'activo' | 'inactivo'
}

/**
 * ✅ Respuesta estándar al crear o actualizar una imagen.
 */
export interface ImagenProductoResponse extends DataResponse<ImagenProducto> {
  message: string
  imagen?: ImagenProducto
}

/**
 * ✅ Respuesta del endpoint index() → listado paginado de imágenes.
 */
export interface ImagenProductoIndexResponse {
  total: number
  data: ImagenProducto[]
}

/**
 * ✅ Respuesta del endpoint showByProducto() → agrupación por producto.
 */
export interface ImagenProductoPorProductoResponse {
  producto_id: number
  principal: ImagenProductoSimple | null
  secundarias: ImagenProductoSimple[]
}

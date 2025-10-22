// src/types/Categoria.ts

import { type DataResponse } from './Common'

/**
 * 🔹 Representa una categoría de productos.
 * Cada categoría agrupa múltiples productos.
 * 
 * Reglas de consistencia aplicadas en el backend:
 *  - nombre y descripción → siempre en MAYÚSCULAS
 *  - estado → siempre en minúsculas ('activo' | 'inactivo')
 */
export interface Categoria {
  id: number
  nombre: string
  descripcion?: string | null
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
}

/**
 * 🔹 Datos enviados al crear una nueva categoría (solo admin).
 */
export interface CategoriaCreateData {
  nombre: string
  descripcion?: string | null
  estado?: 'activo' | 'inactivo'
}

/**
 * 🔹 Datos enviados al actualizar una categoría (solo admin).
 */
export interface CategoriaUpdateData {
  nombre?: string
  descripcion?: string | null
  estado?: 'activo' | 'inactivo'
}

/**
 * 🔹 Respuesta estándar al crear, actualizar o eliminar una categoría.
 */
export interface CategoriaResponse extends DataResponse<Categoria> {}

/**
 * 🔹 Respuesta del endpoint index() → lista paginada de categorías.
 * 
 * Compatible con Laravel paginate().
 */
export interface CategoriaListResponse {
  current_page: number
  data: Categoria[]
  first_page_url: string | null
  from: number | null
  last_page: number
  last_page_url: string | null
  next_page_url: string | null
  prev_page_url: string | null
  path: string
  per_page: number
  to: number | null
  total: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

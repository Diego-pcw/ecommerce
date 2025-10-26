// src/types/Categoria.ts
import { type DataResponse } from './Common'

/**
 * 🔹 Representa una categoría de productos.
 * Reglas backend:
 * - nombre y descripción → MAYÚSCULAS
 * - estado → 'activo' | 'inactivo'
 */
export interface Categoria {
  id: number
  nombre: string
  descripcion?: string | null
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
}

/** 🔹 Datos usados al crear una categoría */
export interface CategoriaCreateData {
  nombre: string
  descripcion?: string | null
  estado?: 'activo' | 'inactivo'
}

/** 🔹 Datos usados al actualizar una categoría */
export interface CategoriaUpdateData {
  nombre?: string
  descripcion?: string | null
  estado?: 'activo' | 'inactivo'
}

/** 🔹 Respuesta común al crear/actualizar/eliminar */
export interface CategoriaResponse extends DataResponse<Categoria> {}

/** 🔹 Lista paginada (Laravel paginate) */
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

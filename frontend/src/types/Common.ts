// src/types/Common.ts

/**
 * Estructura de paginación genérica (Laravel paginate).
 * Reutilizable en todos los módulos.
 */
export interface Paginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

/**
 * Respuesta genérica de la API.
 */
export interface ApiResponse {
  message: string;
  [key: string]: any;
}

/**
 * Respuesta estándar con un dato genérico.
 */
export interface DataResponse<T> {
  message: string;
  data?: T;
}

/**
 * Errores de validación de Laravel.
 */
export interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Respuesta de error con validaciones opcionales.
 */
export interface ErrorResponse {
  message: string;
  errors?: ValidationErrors;
}
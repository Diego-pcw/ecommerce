import api from "./api";
import { type AxiosResponse } from "axios";

/**
 * Interface principal de Categoría
 */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  estado?: "activo" | "inactivo";
  created_at?: string;
  updated_at?: string;
}

/**
 * Estructura para crear o actualizar una categoría
 */
export interface CategoriaInput {
  nombre: string;
  descripcion?: string;
  estado?: "activo" | "inactivo";
}

/**
 * Parámetros opcionales para filtros y paginación
 */
export interface CategoriaQuery {
  estado?: "activo" | "inactivo";
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

/**
 * Servicio centralizado para la gestión de categorías
 */
class CategoriaService {
  /** 🔹 Obtener todas las categorías con filtros, orden y paginación */
  async obtenerTodas(params?: CategoriaQuery): Promise<any> {
    const res: AxiosResponse<any> = await api.get("/categorias", { params });
    return res.data;
  }

  /** 🔹 Obtener una categoría específica (público) */
  async obtenerPorId(id: number): Promise<Categoria> {
    const res: AxiosResponse<Categoria> = await api.get(`/categorias/${id}`);
    return res.data;
  }

  /** 🔸 Crear nueva categoría (solo admin) */
  async crear(data: CategoriaInput): Promise<{ message: string; data: Categoria }> {
    const res: AxiosResponse<{ message: string; data: Categoria }> = await api.post("/categorias", data);
    return res.data;
  }

  /** 🔸 Actualizar categoría (solo admin) */
  async actualizar(
    id: number,
    data: Partial<CategoriaInput>
  ): Promise<{ message: string; data: Categoria }> {
    const res: AxiosResponse<{ message: string; data: Categoria }> = await api.put(`/categorias/${id}`, data);
    return res.data;
  }

  /** 🔸 Eliminar categoría (solo admin) */
  async eliminar(id: number): Promise<{ message: string }> {
    const res: AxiosResponse<{ message: string }> = await api.delete(`/categorias/${id}`);
    return res.data;
  }
}

export default new CategoriaService();

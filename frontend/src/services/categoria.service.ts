import api from "./api";
import type { AxiosResponse } from "axios";
import type {
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
  CategoriaListResponse,
} from "../types/Categoria";

/**
 * Servicio centralizado para gestionar categorías (CRUD)
 */
class CategoriaService {
  /** 🔹 Obtener todas las categorías (público o admin) */
  async obtenerTodas(page = 1, estado: string = "todos"): Promise<CategoriaListResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (estado !== "todos") params.append("estado", estado);

    const res: AxiosResponse<CategoriaListResponse> = await api.get(`/categorias?${params.toString()}`);
    return res.data;
  }

  /** 🔹 Obtener una categoría específica (público) */
  async obtenerPorId(id: number): Promise<Categoria> {
    const res: AxiosResponse<Categoria> = await api.get(`/categorias/${id}`);
    return res.data;
  }

  /** 🔸 Crear una nueva categoría (solo admin) */
  async crear(data: CategoriaCreateData): Promise<{ message: string; data: Categoria }> {
    const res: AxiosResponse<{ message: string; data: Categoria }> = await api.post("/categorias", data);
    return res.data;
  }

  /** 🔸 Actualizar categoría (solo admin) */
  async actualizar(
    id: number,
    data: CategoriaUpdateData
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

export const categoriaService = new CategoriaService();

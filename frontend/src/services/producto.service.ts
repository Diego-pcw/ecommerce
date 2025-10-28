import api from "./api";
import { type AxiosResponse } from "axios";
import {
  type Producto,
  type ProductoCreateData,
  type ProductoUpdateData,
  type ProductoListResponse,
  type ProductoResponse,
  type ProductosOfertasResponse,
} from "../types/Producto";

/**
 * 🧠 Servicio centralizado de Productos
 * Controla la comunicación con el backend (Laravel)
 * según las rutas definidas en routes/api.php
 */
class ProductoService {
  /* -------------------------------------------
   * 📋 Listar productos (paginado, búsqueda, filtros)
   * ----------------------------------------- */
  async obtenerTodos(params?: {
    search?: string;
    categoria_id?: number;
    precio_min?: number;
    precio_max?: number;
    estado?: string;
    sort_by?: string;
    sort_dir?: string;
    page?: number;
    per_page?: number;
  }): Promise<ProductoListResponse> {
    const res: AxiosResponse<ProductoListResponse> = await api.get("/productos", { params });
    return res.data;
  }

  /* -------------------------------------------
   * 🔍 Obtener un producto por ID
   * ----------------------------------------- */
  async obtenerPorId(id: number): Promise<Producto> {
    const res: AxiosResponse<Producto> = await api.get(`/productos/${id}`);
    return res.data;
  }

  /* -------------------------------------------
   * 🎯 Obtener productos con ofertas activas
   * ----------------------------------------- */
  async obtenerConOfertas(): Promise<ProductosOfertasResponse> {
    const res: AxiosResponse<ProductosOfertasResponse> = await api.get("/ofertas");
    return res.data;
  }

  /* -------------------------------------------
   * 🧱 Crear un nuevo producto (solo admin)
   * ----------------------------------------- */
  async crear(data: ProductoCreateData): Promise<ProductoResponse> {
    const token = localStorage.getItem("token");
    const res: AxiosResponse<ProductoResponse> = await api.post("/productos", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  /* -------------------------------------------
   * ✏️ Actualizar producto existente (solo admin)
   * ----------------------------------------- */
  async actualizar(id: number, data: ProductoUpdateData): Promise<ProductoResponse> {
    const token = localStorage.getItem("token");
    const res: AxiosResponse<ProductoResponse> = await api.put(`/productos/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  /* -------------------------------------------
   * 🗑️ Eliminar producto (solo admin)
   * ----------------------------------------- */
  async eliminar(id: number): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    const res: AxiosResponse<{ message: string }> = await api.delete(`/productos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

export const productoService = new ProductoService();
export default productoService;

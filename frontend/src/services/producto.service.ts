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
   * 🎯 Productos con ofertas activas
   * ----------------------------------------- */
  async obtenerConOfertas(): Promise<ProductosOfertasResponse> {
    const res: AxiosResponse<ProductosOfertasResponse> = await api.get("/ofertas");
    return res.data;
  }

  /* -------------------------------------------
   * 🧱 Crear producto (solo admin)
   * ----------------------------------------- */
  async crear(data: ProductoCreateData): Promise<ProductoResponse> {
    const res: AxiosResponse<ProductoResponse> = await api.post("/productos", data);
    return res.data;
  }

  /* -------------------------------------------
   * ✏️ Actualizar producto (solo admin)
   * ----------------------------------------- */
  async actualizar(id: number, data: ProductoUpdateData): Promise<ProductoResponse> {
    const res: AxiosResponse<ProductoResponse> = await api.put(`/productos/${id}`, data);
    return res.data;
  }

  /* -------------------------------------------
   * 🗑️ Eliminar producto (solo admin)
   * ----------------------------------------- */
  async eliminar(id: number): Promise<{ message: string }> {
    const res: AxiosResponse<{ message: string }> = await api.delete(`/productos/${id}`);
    return res.data;
  }
}

export const productoService = new ProductoService();
export default productoService;

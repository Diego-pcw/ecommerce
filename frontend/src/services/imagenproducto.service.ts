import api from "./api";
import { type AxiosResponse } from "axios";
import {
  type ImagenProductoCreateData,
  type ImagenProductoUpdateData,
  type ImagenProductoResponse,
  type ImagenProductoIndexResponse,
  type ImagenProductoPorProductoResponse,
} from "../types/ImagenProducto";

/**
 * 🧠 Servicio centralizado de Imágenes de Productos
 * Controla la comunicación con el backend (Laravel)
 */
class ImagenProductoService {
  /* -------------------------------------------
   * 📋 Listar todas las imágenes (solo admin)
   * ----------------------------------------- */
  async obtenerTodas(params?: Record<string, any>): Promise<ImagenProductoIndexResponse> {
    const token = localStorage.getItem("token");
    const res: AxiosResponse<ImagenProductoIndexResponse> = await api.get("/imagenes", {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  /* -------------------------------------------
   * 🔍 Obtener imágenes por producto (público)
   * ----------------------------------------- */
  async obtenerPorProducto(producto_id: number): Promise<ImagenProductoPorProductoResponse> {
    const res: AxiosResponse<ImagenProductoPorProductoResponse> = await api.get(
      `/imagenes/producto/${producto_id}`
    );
    return res.data;
  }

  /* -------------------------------------------
   * 🖼️ Crear nueva imagen (solo admin)
   * ----------------------------------------- */
  async crear(data: ImagenProductoCreateData): Promise<ImagenProductoResponse> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("producto_id", String(data.producto_id));
    formData.append("imagen", data.imagen);
    if (data.alt_text) formData.append("alt_text", data.alt_text);
    if (data.principal !== undefined) formData.append("principal", String(data.principal));
    if (data.orden !== undefined) formData.append("orden", String(data.orden));

    const res: AxiosResponse<ImagenProductoResponse> = await api.post("/imagenes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  /* -------------------------------------------
   * ✏️ Actualizar imagen existente
   * ----------------------------------------- */
  async actualizar(id: number, data: ImagenProductoUpdateData): Promise<ImagenProductoResponse> {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (data.imagen) formData.append("imagen", data.imagen);
    if (data.alt_text) formData.append("alt_text", data.alt_text);
    if (data.principal !== undefined) formData.append("principal", String(data.principal));
    if (data.orden !== undefined) formData.append("orden", String(data.orden));
    if (data.estado) formData.append("estado", data.estado);

    const res: AxiosResponse<ImagenProductoResponse> = await api.post(
      `/imagenes/${id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  /* -------------------------------------------
   * 🗑️ Eliminar imagen
   * ----------------------------------------- */
  async eliminar(id: number): Promise<{ message: string }> {
    const token = localStorage.getItem("token");
    const res: AxiosResponse<{ message: string }> = await api.delete(`/imagenes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

export const imagenProductoService = new ImagenProductoService();
export default imagenProductoService;

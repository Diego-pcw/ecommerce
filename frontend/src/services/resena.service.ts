//resena.service.ts → reseñas.
import api from "./api";

export interface Resena {
  id: number;
  user_id: number;
  producto_id: number;
  rating: number;
  titulo?: string;
  comentario: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  producto?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}

export interface ResenaQueryParams {
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  producto_id?: number;
  sort_by?: string;
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export const resenaService = {
  /**
   * 📋 Listar reseñas (con filtros, paginación y visibilidad por rol)
   * - Admin ve todas
   * - Usuario/visitante solo las aprobadas
   */
  async getAll(params?: ResenaQueryParams) {
    const { data } = await api.get("/resenas", { params });
    return data;
  },

  /**
   * 🧾 Crear una nueva reseña
   * Requiere usuario autenticado
   */
  async create(payload: {
    producto_id: number;
    rating: number;
    titulo?: string;
    comentario: string;
  }) {
    const { data } = await api.post("/resenas", payload);
    return data;
  },

  /**
   * 🔍 Mostrar una reseña individual
   */
  async getById(id: number) {
    const { data } = await api.get(`/resenas/${id}`);
    return data;
  },

  /**
   * ✏️ Actualizar reseña (solo admin/moderador)
   */
  async update(
    id: number,
    payload: {
      estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
      titulo?: string;
      comentario?: string;
      rating?: number;
    }
  ) {
    const { data } = await api.put(`/resenas/${id}`, payload);
    return data;
  },

  /**
   * 🗑️ Eliminar reseña (solo admin)
   */
  async delete(id: number) {
    const { data } = await api.delete(`/resenas/${id}`);
    return data;
  },
};

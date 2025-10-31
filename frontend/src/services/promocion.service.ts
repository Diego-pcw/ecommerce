import api from "./api";
import type {
  Promocion,
  PromocionCreateData,
  PromocionUpdateData,
  AsignarProductosData,
  PromocionResponse,
  AsignarProductosResponse,
  PromocionListResponse,
} from "../types/Promocion";

/**
 * 🎯 Servicio para gestionar las promociones
 * Compatible con los endpoints del backend Laravel.
 */
export const promocionService = {
  /**
   * 🔹 Obtener todas las promociones (paginadas o completas)
   */
  async listar(params?: Record<string, any>): Promise<PromocionListResponse> {
    const { data } = await api.get("/promociones", { params });
    return data;
  },

  /**
   * 🔹 Obtener una promoción específica por ID
   */
  async obtener(id: number): Promise<Promocion> {
    const { data } = await api.get(`/promociones/${id}`);
    return data;
  },

  /**
   * 🔸 Crear una nueva promoción
   */
  async crear(payload: PromocionCreateData): Promise<PromocionResponse> {
    const { data } = await api.post("/promociones", payload);
    return data;
  },

  /**
   * 🔸 Actualizar una promoción existente
   */
  async actualizar(
    id: number,
    payload: PromocionUpdateData
  ): Promise<PromocionResponse> {
    const { data } = await api.put(`/promociones/${id}`, payload);
    return data;
  },

  /**
   * 🔸 Eliminar una promoción
   */
  async eliminar(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/promociones/${id}`);
    return data;
  },

  /**
   * 🔸 Asignar productos a una promoción
   */
  async asignarProductos(
    id: number,
    payload: AsignarProductosData
  ): Promise<AsignarProductosResponse> {
    const { data } = await api.post(`/promociones/${id}/asignar`, payload);
    return data;
  },
};

export default promocionService;

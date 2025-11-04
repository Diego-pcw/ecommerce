import api from "./api";
import {
  type ContactMessage,
  type ContactMessageCreateData,
  type ContactMessageUpdateData,
  type ContactMessageIndexResponse,
  type ContactMessageResponse,
} from "../types/ContactMessage";

export interface ContactQueryParams {
  estado?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export const contactService = {
  /** 📋 Listar mensajes (admin ve todos / usuario ve los suyos) */
  async getAll(params?: ContactQueryParams): Promise<ContactMessageIndexResponse> {
    const { data } = await api.get("/contact-messages", { params });
    return data;
  },

  /** 🧾 Crear un nuevo mensaje */
  async create(payload: ContactMessageCreateData): Promise<ContactMessageResponse> {
    const { data } = await api.post("/contact-messages", payload);
    return data;
  },

  /** 🔍 Mostrar un mensaje */
  async getById(id: number): Promise<ContactMessage> {
    const { data } = await api.get(`/contact-messages/${id}`);
    return data;
  },

  /** ✏️ Actualizar o responder mensaje (solo admin) */
  async update(id: number, payload: ContactMessageUpdateData): Promise<ContactMessageResponse> {
    const { data } = await api.put(`/contact-messages/${id}`, payload);
    return data;
  },

  /** 🗑️ Eliminar mensaje (solo admin) */
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/contact-messages/${id}`);
    return data;
  },
};

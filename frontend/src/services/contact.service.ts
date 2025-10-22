//contact.service.ts → mensajes de contacto.
import api from "./api";

export interface ContactMessage {
  id: number;
  user_id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  mensaje: string;
  canal_preferido: "EMAIL" | "WHATSAPP" | "TELEFONO";
  estado: "NUEVO" | "RESPONDIDO" | "CERRADO";
  respuesta?: string | null;
  fecha_respuesta?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactQueryParams {
  estado?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}

export const contactService = {
  /**
   * 📋 Listar mensajes de contacto (admin ve todos / usuario solo los suyos)
   */
  async getAll(params?: ContactQueryParams) {
    const { data } = await api.get("/contact-messages", { params });
    return data;
  },

  /**
   * 🧾 Enviar nuevo mensaje de contacto
   */
  async createMessage(payload: {
    mensaje: string;
    telefono?: string;
    canal_preferido?: "EMAIL" | "WHATSAPP" | "TELEFONO";
  }) {
    const { data } = await api.post("/contact-messages", payload);
    return data;
  },

  /**
   * 🔍 Mostrar mensaje individual
   */
  async getMessageById(id: number) {
    const { data } = await api.get(`/contact-messages/${id}`);
    return data;
  },

  /**
   * ✏️ Actualizar o responder mensaje (solo admin)
   */
  async updateMessage(
    id: number,
    payload: {
      estado?: "NUEVO" | "RESPONDIDO" | "CERRADO";
      respuesta?: string;
    }
  ) {
    const { data } = await api.put(`/contact-messages/${id}`, payload);
    return data;
  },

  /**
   * 🗑️ Eliminar mensaje (solo admin)
   */
  async deleteMessage(id: number) {
    const { data } = await api.delete(`/contact-messages/${id}`);
    return data;
  },
};

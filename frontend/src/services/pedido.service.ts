//pedido.service.ts → pedidos y detalles.
import api from "./api";
import { type AxiosResponse } from "axios";

/* -------------------------------------------
 * 🧩 Interfaces principales
 * ----------------------------------------- */
export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  producto?: {
    id: number;
    nombre: string;
    precio: number;
    imagenes?: { url: string }[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface Pedido {
  id: number;
  user_id: number;
  total: number;
  estado: "PENDIENTE" | "PAGADO" | "ENVIADO" | "CANCELADO" | "ENTREGADO";
  shipping_address: Record<string, any> | string;
  payment_method: string;
  detalles?: DetallePedido[];
  created_at?: string;
  updated_at?: string;
}

/* -------------------------------------------
 * ✏️ Estructuras de entrada
 * ----------------------------------------- */
export interface CrearPedidoInput {
  shipping_address: Record<string, any>;
  payment_method: string;
  items: {
    producto_id: number;
    cantidad: number;
    precio_unitario?: number;
  }[];
}

export interface ActualizarPedidoEstadoInput {
  estado: "PENDIENTE" | "PAGADO" | "ENVIADO" | "CANCELADO" | "ENTREGADO";
}

/* -------------------------------------------
 * ⚙️ Servicio centralizado de Pedidos
 * ----------------------------------------- */
class PedidoService {
  /**
   * 📋 Listar pedidos (admin ve todos, usuario solo los suyos)
   */
  async listar(params?: {
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    per_page?: number;
    page?: number;
  }): Promise<{
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
    data: Pedido[];
  }> {
    const res: AxiosResponse = await api.get("/pedidos", { params });
    return res.data;
  }

  /**
   * 🧾 Crear un nuevo pedido (usuario autenticado)
   */
  async crear(data: CrearPedidoInput): Promise<{ message: string; data: Pedido }> {
    const res: AxiosResponse = await api.post("/pedidos", data);
    return res.data;
  }

  /**
   * 🔍 Mostrar un pedido específico (solo admin o dueño)
   */
  async obtenerPorId(id: number): Promise<Pedido> {
    const res: AxiosResponse<Pedido> = await api.get(`/pedidos/${id}`);
    return res.data;
  }

  /**
   * ✏️ Actualizar estado del pedido (solo admin)
   */
  async actualizarEstado(id: number, data: ActualizarPedidoEstadoInput): Promise<{ message: string; data: Pedido }> {
    const res: AxiosResponse = await api.put(`/pedidos/${id}`, data);
    return res.data;
  }

  /**
   * 🗑️ Eliminar pedido (solo admin)
   */
  async eliminar(id: number): Promise<{ message: string }> {
    const res: AxiosResponse = await api.delete(`/pedidos/${id}`);
    return res.data;
  }

  // -------------------------------------------------------------------
  // 📦 DETALLES DE PEDIDO (solo admin para gestión o consulta avanzada)
  // -------------------------------------------------------------------

  /**
   * 📦 Listar los detalles de un pedido
   */
  async listarDetalles(pedidoId: number): Promise<DetallePedido[]> {
    const res: AxiosResponse<DetallePedido[]> = await api.get(`/pedidos/${pedidoId}/detalles`);
    return res.data;
  }

  /**
   * ➕ Agregar un producto a un pedido (solo admin)
   */
  async agregarDetalle(
    pedidoId: number,
    data: { producto_id: number; cantidad: number; precio_unitario: number }
  ): Promise<{ message: string; data: DetallePedido }> {
    const res: AxiosResponse = await api.post(`/pedidos/${pedidoId}/detalles`, data);
    return res.data;
  }

  /**
   * ✏️ Actualizar un detalle del pedido (solo admin)
   */
  async actualizarDetalle(
    detalleId: number,
    data: Partial<{ cantidad: number; precio_unitario: number }>
  ): Promise<{ message: string; data: DetallePedido }> {
    const res: AxiosResponse = await api.put(`/detalles-pedido/${detalleId}`, data);
    return res.data;
  }

  /**
   * ❌ Eliminar un detalle del pedido (solo admin)
   */
  async eliminarDetalle(detalleId: number): Promise<{ message: string }> {
    const res: AxiosResponse = await api.delete(`/detalles-pedido/${detalleId}`);
    return res.data;
  }
}

export default new PedidoService();

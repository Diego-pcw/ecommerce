// src/services/carrito.service.ts
import api from "./api";
import { type AxiosResponse } from "axios";
import {
  type Carrito,
  type CarritoObtenerResponse,
  type CarritoAgregarResponse,
  type CarritoActualizarResponse,
  type CarritoEliminarResponse,
  type CarritoMostrarResponse,
  type CarritoIndexResponse,
  type AgregarProductoData,
  type ActualizarCantidadData,
} from "../types/Carrito";

/**
 * 🛒 Servicio centralizado para gestionar el carrito de compras.
 * Compatible con usuarios autenticados y sesiones invitadas.
 */
class CarritoService {
  /**
   * 🔹 Obtener el carrito actual (usuario autenticado o invitado)
   * - Usa header `X-Session-Id` si el usuario no está logueado
   */
  async obtenerCarrito(sessionId?: string): Promise<CarritoObtenerResponse> {
    const res: AxiosResponse<CarritoObtenerResponse> = await api.get("/carrito", {
      headers: sessionId ? { "X-Session-Id": sessionId } : undefined,
    });
    return res.data;
  }

  /**
   * 🔹 Agregar un producto al carrito
   */
  async agregarProducto(
    data: AgregarProductoData,
    sessionId?: string
  ): Promise<CarritoAgregarResponse> {
    const res: AxiosResponse<CarritoAgregarResponse> = await api.post("/carrito/agregar", data, {
      headers: sessionId ? { "X-Session-Id": sessionId } : undefined,
    });
    return res.data;
  }

  /**
   * 🔹 Actualizar cantidad de un producto en el carrito
   */
  async actualizarCantidad(
    carritoId: number,
    data: ActualizarCantidadData
  ): Promise<CarritoActualizarResponse> {
    const res: AxiosResponse<CarritoActualizarResponse> = await api.put(
      `/carrito/${carritoId}/actualizar`,
      data
    );
    return res.data;
  }

  /**
   * 🔹 Eliminar un producto del carrito
   */
  async eliminarProducto(carritoId: number, productoId: number): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/carrito/${carritoId}/eliminar/${productoId}`
    );
    return res.data;
  }

  /**
   * 🔹 Vaciar completamente el carrito
   */
  async vaciarCarrito(carritoId: number): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/carrito/${carritoId}/vaciar`
    );
    return res.data;
  }

  /**
   * 🔹 Mostrar carrito con todos los productos y total
   */
  async mostrar(carritoId: number): Promise<CarritoMostrarResponse> {
    const res: AxiosResponse<CarritoMostrarResponse> = await api.get(`/carrito/${carritoId}`);
    return res.data;
  }

  /**
   * 🔸 Listar todos los carritos (solo para administrador)
   */
  async listar(params?: {
    estado?: string;
    sessionId?: string;
    userId?: number;
    page?: number;
    per_page?: number;
    sort?: string;
  }): Promise<CarritoIndexResponse> {
    const res: AxiosResponse<CarritoIndexResponse> = await api.get("/carritos", { params });
    return res.data;
  }
}

export default new CarritoService();

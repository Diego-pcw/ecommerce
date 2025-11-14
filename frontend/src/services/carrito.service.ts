import api from "./api";
import { type AxiosResponse } from "axios";

import {
  type CarritoObtenerResponse,
  type CarritoAgregarResponse,
  type CarritoActualizarResponse,
  type CarritoEliminarResponse,
  type CarritoMostrarResponse,
  type CarritoIndexResponse,
  type AgregarProductoData,
  type ActualizarCantidadData,
} from "../types/Carrito";

class CarritoService {
  /** 🔹 Obtener carrito actual (usuario o invitado) */
  async obtenerCarrito(): Promise<CarritoObtenerResponse> {
    const sessionId = localStorage.getItem("session_id");
    const headers = sessionId ? { "X-Session-Id": sessionId } : {};

    const res: AxiosResponse<CarritoObtenerResponse> = await api.get(
      "/carrito",
      { headers }
    );

    // ✔ Guardar session_id nuevo si el backend envió uno
    if (res.data.session_id && !localStorage.getItem("session_id")) {
      localStorage.setItem("session_id", res.data.session_id);
    }

    return res.data;
  }

  /** 🔹 Agregar producto */
  async agregarProducto(
    data: AgregarProductoData
  ): Promise<CarritoAgregarResponse> {
    const sessionId = localStorage.getItem("session_id");
    const headers = sessionId ? { "X-Session-Id": sessionId } : {};

    const res: AxiosResponse<CarritoAgregarResponse> = await api.post(
      "/carrito/agregar",
      data,
      { headers }
    );

    // ✔ Si backend genera nuevo session_id
    if (res.data.session_id && res.data.session_id !== sessionId) {
      localStorage.setItem("session_id", res.data.session_id);
    }

    return res.data;
  }

  /** 🔹 Actualizar cantidad */
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

  /** 🔹 Eliminar producto */
  async eliminarProducto(
    carritoId: number,
    productoId: number
  ): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/carrito/${carritoId}/eliminar/${productoId}`
    );
    return res.data;
  }

  /** 🔹 Vaciar carrito */
  async vaciarCarrito(carritoId: number): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/carrito/${carritoId}/vaciar`
    );
    return res.data;
  }

  /** 🔹 Mostrar carrito completo */
  async mostrarCarrito(carritoId: number): Promise<CarritoMostrarResponse> {
    const res: AxiosResponse<CarritoMostrarResponse> = await api.get(
      `/carrito/${carritoId}`
    );
    return res.data;
  }

  // ==============================
  // 👤 CARRITO USUARIO AUTENTICADO
  // ==============================
  async obtenerCarritoUsuario(): Promise<CarritoObtenerResponse> {
    const res = await api.get("/user/carrito");
    return res.data;
  }

  async agregarProductoUsuario(
    data: AgregarProductoData
  ): Promise<CarritoAgregarResponse> {
    const res = await api.post("/user/carrito/agregar", data);
    return res.data;
  }

  async actualizarCantidadUsuario(
    carritoId: number,
    data: ActualizarCantidadData
  ): Promise<CarritoActualizarResponse> {
    const res = await api.put(`/user/carrito/${carritoId}/actualizar`, data);
    return res.data;
  }

  async eliminarProductoUsuario(
    carritoId: number,
    productoId: number
  ): Promise<CarritoEliminarResponse> {
    const res = await api.delete(`/user/carrito/${carritoId}/eliminar/${productoId}`);
    return res.data;
  }

  async vaciarCarritoUsuario(
    carritoId: number
  ): Promise<CarritoEliminarResponse> {
    const res = await api.delete(`/user/carrito/${carritoId}/vaciar`);
    return res.data;
  }

  // ==============================
  // 🔁 FUSIÓN DE CARRITOS
  // ==============================
  async fusionarCarrito(sessionId: string): Promise<CarritoObtenerResponse> {
    const res = await api.post("/carrito/fusionar", {
      session_id: sessionId,
    });

    // ✔ session_id invitado ya no es necesario
    localStorage.removeItem("session_id");

    return res.data;
  }

  // ==============================
  // 🧩 ADMIN
  // ==============================
  async listarCarritos(params?: {
    estado?: string;
    session_id?: string;
    user_id?: number;
    sort?: string;
    per_page?: number;
    page?: number;
  }): Promise<CarritoIndexResponse> {
    const res = await api.get("/carritos", { params });
    return res.data;
  }
}

export default new CarritoService();

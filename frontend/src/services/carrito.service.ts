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

class CarritoService {
  // =====================================================
  // 🛍️ CARRITO PÚBLICO / INVITADO
  // =====================================================

  /** 🔹 Obtener carrito actual (usuario o invitado) */
  async obtenerCarrito(): Promise<CarritoObtenerResponse> {
    const sessionId = localStorage.getItem("session_id");
    const headers = sessionId ? { "X-Session-Id": sessionId } : {};

    const res: AxiosResponse<CarritoObtenerResponse> = await api.get(
      "/carrito",
      { headers }
    );

    // ✅ Si el backend devolvió un session_id nuevo, guardarlo
    if (res.data.session_id && !localStorage.getItem("session_id")) {
      localStorage.setItem("session_id", res.data.session_id);
    }

    return res.data;
  }

  /** 🔹 Agregar producto al carrito */
  async agregarProducto(data: AgregarProductoData): Promise<CarritoAgregarResponse> {
    const sessionId = localStorage.getItem("session_id");
    const headers = sessionId ? { "X-Session-Id": sessionId } : {};

    const res: AxiosResponse<CarritoAgregarResponse> = await api.post(
      "/carrito/agregar",
      data,
      { headers }
    );

    // ✅ Guardar session_id si es nuevo
    if (res.data.session_id && res.data.session_id !== sessionId) {
      localStorage.setItem("session_id", res.data.session_id);
    }

    return res.data;
  }

  /** 🔹 Actualizar cantidad de producto */
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

  /** 🔹 Eliminar producto del carrito */
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

  // =====================================================
  // 👤 CARRITO DE USUARIO AUTENTICADO
  // =====================================================

  /** 🔹 Obtener carrito del usuario autenticado */
  async obtenerCarritoUsuario(): Promise<CarritoObtenerResponse> {
    const res: AxiosResponse<CarritoObtenerResponse> = await api.get("/user/carrito");
    return res.data;
  }

  /** 🔹 Agregar producto (usuario autenticado) */
  async agregarProductoUsuario(data: AgregarProductoData): Promise<CarritoAgregarResponse> {
    const res: AxiosResponse<CarritoAgregarResponse> = await api.post(
      "/user/carrito/agregar",
      data
    );
    return res.data;
  }

  /** 🔹 Actualizar cantidad (usuario autenticado) */
  async actualizarCantidadUsuario(
    carritoId: number,
    data: ActualizarCantidadData
  ): Promise<CarritoActualizarResponse> {
    const res: AxiosResponse<CarritoActualizarResponse> = await api.put(
      `/user/carrito/${carritoId}/actualizar`,
      data
    );
    return res.data;
  }

  /** 🔹 Eliminar producto (usuario autenticado) */
  async eliminarProductoUsuario(
    carritoId: number,
    productoId: number
  ): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/user/carrito/${carritoId}/eliminar/${productoId}`
    );
    return res.data;
  }

  /** 🔹 Vaciar carrito (usuario autenticado) */
  async vaciarCarritoUsuario(carritoId: number): Promise<CarritoEliminarResponse> {
    const res: AxiosResponse<CarritoEliminarResponse> = await api.delete(
      `/user/carrito/${carritoId}/vaciar`
    );
    return res.data;
  }

  // =====================================================
  // 🔁 FUSIÓN DE CARRITOS (LOGIN)
  // =====================================================

  /** 🔹 Fusionar carrito invitado con el del usuario autenticado */
  async fusionarCarrito(sessionId: string): Promise<CarritoObtenerResponse> {
    const res: AxiosResponse<CarritoObtenerResponse> = await api.post(
      "/carrito/fusionar",
      { session_id: sessionId }
    );

    // ✅ Limpieza local tras la fusión
    localStorage.removeItem("session_id");

    return res.data;
  }

  // =====================================================
  // 🧩 ADMINISTRACIÓN (solo admin)
  // =====================================================

  /** 🔹 Listar carritos con filtros (solo admin) */
  async listarCarritos(params?: {
    estado?: string;
    session_id?: string;
    user_id?: number;
    sort?: string;
    per_page?: number;
    page?: number;
  }): Promise<CarritoIndexResponse> {
    const res: AxiosResponse<CarritoIndexResponse> = await api.get("/carritos", {
      params,
    });
    return res.data;
  }
}

export default new CarritoService();

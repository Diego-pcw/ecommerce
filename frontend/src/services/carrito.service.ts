//carrito.service.ts → carrito y sus detalles.
import api from "./api";
import { type AxiosResponse } from "axios";

/* -------------------------------------------
 * 🧩 Interfaces principales
 * ----------------------------------------- */
export interface DetalleCarrito {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: {
    id: number;
    nombre: string;
    precio_original: number;
    precio_final?: number;
    imagenes?: { url: string }[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface Carrito {
  id: number;
  user_id?: number | null;
  session_id?: string;
  estado?: "activo" | "expirado";
  total?: number;
  esta_vacio?: boolean;
  detalles?: DetalleCarrito[];
  created_at?: string;
  updated_at?: string;
}

/* -------------------------------------------
 * ✏️ Estructuras de entrada
 * ----------------------------------------- */
export interface AgregarProductoInput {
  producto_id: number;
  cantidad?: number;
}

export interface ActualizarCantidadInput {
  producto_id: number;
  cantidad: number;
}

/* -------------------------------------------
 * ⚙️ Servicio centralizado de Carrito
 * ----------------------------------------- */
class CarritoService {
  /**
   * 🔹 Obtener el carrito activo (usuario autenticado o invitado)
   * - Usa header X-Session-Id si el usuario no está logueado
   */
  async obtenerCarrito(sessionId?: string): Promise<{ session_id: string; carrito: Carrito }> {
    const res: AxiosResponse = await api.get("/carrito", {
      headers: sessionId ? { "X-Session-Id": sessionId } : undefined,
    });
    return res.data;
  }

  /**
   * 🔹 Agregar un producto al carrito
   */
  async agregarProducto(
    data: AgregarProductoInput,
    sessionId?: string
  ): Promise<{ message: string; session_id: string; carrito: Carrito }> {
    const res: AxiosResponse = await api.post("/carrito/agregar", data, {
      headers: sessionId ? { "X-Session-Id": sessionId } : undefined,
    });
    return res.data;
  }

  /**
   * 🔹 Actualizar la cantidad de un producto
   */
  async actualizarCantidad(
    carritoId: number,
    data: ActualizarCantidadInput
  ): Promise<{ message: string; detalle: DetalleCarrito }> {
    const res: AxiosResponse = await api.put(`/carrito/${carritoId}/cantidad`, data);
    return res.data;
  }

  /**
   * 🔹 Eliminar un producto del carrito
   */
  async eliminarProducto(carritoId: number, productoId: number): Promise<{ message: string }> {
    const res: AxiosResponse = await api.delete(`/carrito/${carritoId}/producto/${productoId}`);
    return res.data;
  }

  /**
   * 🔹 Vaciar completamente el carrito
   */
  async vaciarCarrito(carritoId: number): Promise<{ message: string }> {
    const res: AxiosResponse = await api.delete(`/carrito/${carritoId}/vaciar`);
    return res.data;
  }

  /**
   * 🔹 Mostrar carrito con total
   */
  async mostrar(carritoId: number): Promise<{ carrito: Carrito; total: number; esta_vacio: boolean }> {
    const res: AxiosResponse = await api.get(`/carrito/${carritoId}`);
    return res.data;
  }

  /**
   * 🔸 Listar todos los carritos (solo admin)
   */
  async listar(params?: {
    estado?: string;
    session_id?: string;
    user_id?: number;
    sort?: string;
    per_page?: number;
    page?: number;
  }): Promise<any> {
    const res: AxiosResponse = await api.get("/carritos", { params });
    return res.data;
  }
}

export default new CarritoService();

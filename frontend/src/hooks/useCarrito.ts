import { useState, useEffect, useCallback } from "react";
import carritoService from "../services/carrito.service";
import authService from "../services/auth.service";
import type {
  Carrito,
  AgregarProductoData,
  ActualizarCantidadData,
} from "../types/Carrito";

/**
 * 🧠 Hook personalizado para manejar el carrito de compras.
 * - Distingue entre usuario autenticado e invitado
 * - Sincroniza automáticamente con el backend
 * - Guarda y limpia session_id según corresponda
 */
export const useCarrito = () => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem("session_id")
  );
  const [loading, setLoading] = useState(false);

  const isAuthenticated = authService.isAuthenticated();

  /** 🔹 Obtener o crear carrito actual */
  const obtenerCarrito = useCallback(async () => {
    try {
      setLoading(true);

      const res = isAuthenticated
        ? await carritoService.obtenerCarritoUsuario()
        : await carritoService.obtenerCarrito();

      setCarrito(res.carrito);

      // Si el backend devolvió un nuevo session_id (para invitado)
      if (res.session_id && !isAuthenticated) {
        setSessionId(res.session_id);
        localStorage.setItem("session_id", res.session_id);
      }
    } catch (err) {
      console.error("❌ Error al obtener carrito:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /** 🔹 Agregar producto */
  const agregarProducto = async (data: AgregarProductoData) => {
    try {
      setLoading(true);

      const res = isAuthenticated
        ? await carritoService.agregarProductoUsuario(data)
        : await carritoService.agregarProducto(data);

      setCarrito(res.carrito);

      if (res.session_id && !isAuthenticated) {
        setSessionId(res.session_id);
        localStorage.setItem("session_id", res.session_id);
      }
    } catch (err) {
      console.error("❌ Error al agregar producto:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Actualizar cantidad de producto */
  const actualizarCantidad = async (productoId: number, cantidad: number) => {
    if (!carrito) return;
    try {
      setLoading(true);
      const data: ActualizarCantidadData = { producto_id: productoId, cantidad };

      if (isAuthenticated)
        await carritoService.actualizarCantidadUsuario(carrito.id, data);
      else
        await carritoService.actualizarCantidad(carrito.id, data);

      // Refrescar datos locales
      setCarrito((prev) => {
        if (!prev) return prev;
        const nuevosDetalles = prev.detalles?.map((d) =>
          d.producto_id === productoId ? { ...d, cantidad } : d
        );
        return { ...prev, detalles: nuevosDetalles };
      });
    } catch (err) {
      console.error("❌ Error al actualizar cantidad:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Eliminar producto del carrito */
  const eliminarProducto = async (productoId: number) => {
    if (!carrito) return;
    try {
      setLoading(true);

      if (isAuthenticated)
        await carritoService.eliminarProductoUsuario(carrito.id, productoId);
      else
        await carritoService.eliminarProducto(carrito.id, productoId);

      setCarrito((prev) => {
        if (!prev) return prev;
        const nuevosDetalles = prev.detalles?.filter(
          (d) => d.producto_id !== productoId
        );
        return { ...prev, detalles: nuevosDetalles };
      });
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Vaciar carrito completo */
  const vaciarCarrito = async () => {
    if (!carrito) return;
    try {
      setLoading(true);

      if (isAuthenticated)
        await carritoService.vaciarCarritoUsuario(carrito.id);
      else
        await carritoService.vaciarCarrito(carrito.id);

      setCarrito({ ...carrito, detalles: [], total: 0, esta_vacio: true });
    } catch (err) {
      console.error("❌ Error al vaciar carrito:", err);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Total calculado localmente */
  const calcularTotal = useCallback((): number => {
    if (!carrito?.detalles) return 0;
    return carrito.detalles.reduce(
      (acc, item) => acc + Number(item.cantidad) * Number(item.precio_unitario),
      0
    );
  }, [carrito]);

  /** 🧩 Inicializar */
  useEffect(() => {
    void obtenerCarrito();
  }, [obtenerCarrito]);

  return {
    carrito,
    detalles: carrito?.detalles || [],
    sessionId,
    loading,
    isAuthenticated,
    obtenerCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    calcularTotal,
  };
};

export default useCarrito;

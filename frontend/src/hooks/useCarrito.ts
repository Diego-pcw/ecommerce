// src/hooks/useCarrito.ts
import { useState, useEffect, useCallback } from "react";
import carritoService from "../services/carrito.service";
import type {
  Carrito,
  CarritoDetalle,
  AgregarProductoData,
  ActualizarCantidadData,
} from "../types/Carrito";

/**
 * 🧠 Hook personalizado para manejar el carrito de compras.
 * - Controla sesión (user_id o session_id)
 * - Sincroniza con backend
 * - Mantiene estado en memoria y localStorage
 */
export const useCarrito = () => {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem("session_id")
  );
  const [loading, setLoading] = useState(false);

  /** 🔹 Obtener o crear carrito actual */
  const obtenerCarrito = useCallback(async () => {
    try {
      setLoading(true);
      const res = await carritoService.obtenerCarrito(sessionId || undefined);
      setCarrito(res.carrito);

      if (res.session_id) {
        setSessionId(res.session_id);
        localStorage.setItem("session_id", res.session_id);
      }
    } catch (err) {
      console.error("❌ Error al obtener carrito:", err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  /** 🔹 Agregar producto */
  const agregarProducto = async (data: AgregarProductoData) => {
    try {
      setLoading(true);
      const res = await carritoService.agregarProducto(data, sessionId || undefined);
      setCarrito(res.carrito);

      if (res.session_id) {
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
      const res = await carritoService.actualizarCantidad(carrito.id, data);

      // Actualiza el detalle dentro del carrito
      setCarrito((prev) => {
        if (!prev) return prev;
        const nuevosDetalles = prev.detalles?.map((d) =>
          d.producto_id === productoId ? { ...d, cantidad } : d
        );
        return { ...prev, detalles: nuevosDetalles };
      });

      return res.detalle;
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
      (acc, item) => acc + item.cantidad * item.precio_unitario,
      0
    );
  }, [carrito]);

  useEffect(() => {
    void obtenerCarrito();
  }, [obtenerCarrito]);

  return {
    carrito,
    detalles: carrito?.detalles || [],
    sessionId,
    loading,
    obtenerCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    calcularTotal,
  };
};

export default useCarrito;

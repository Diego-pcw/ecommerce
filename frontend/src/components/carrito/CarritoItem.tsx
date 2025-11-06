// -----------------------------------------------------------------------------
// src/components/carrito/CarritoItem.tsx
// -----------------------------------------------------------------------------
import React, { useState } from "react";
import type { CarritoDetalle } from "../../types/CarritoDetalle";
import { useCarritoContext } from "../../context/CarritoContext";
import { useToast } from "../../context/ToastContext";
import styles from "../../styles/carritos/Carrito.module.css";

interface Props {
  detalle: CarritoDetalle;
}

const CarritoItem: React.FC<Props> = ({ detalle }) => {
  const { actualizarCantidad, eliminarProducto } = useCarritoContext();
  const { push } = useToast();
  const [cantidad, setCantidad] = useState<number>(Number(detalle.cantidad));
  const [updating, setUpdating] = useState(false);

  const onChange = async (value: number) => {
    if (value < 1) return;
    setCantidad(value);
    setUpdating(true);
    try {
      await actualizarCantidad(detalle.producto_id, value);
      push(
        `Cantidad de ${detalle.producto?.nombre ?? "producto"} actualizada.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      setCantidad(Number(detalle.cantidad));
      push("No se pudo actualizar la cantidad.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleEliminar = async () => {
    try {
      await eliminarProducto(detalle.producto_id);
      push(`${detalle.producto?.nombre ?? "Producto"} eliminado del carrito.`, "warning");
    } catch (err) {
      console.error(err);
      push("Error al eliminar el producto.", "error");
    }
  };

  const precioUnit = Number(detalle.precio_unitario);
  const subtotal = Number(detalle.cantidad) * precioUnit;

  // 🟢 Nuevo: detectar si hay descuento activo
  const tieneDescuento =
    detalle.precio_original && detalle.precio_original > detalle.precio_unitario;

  return (
    <tr>
      <td>
        <div className="producto-info">
          <div className="producto-nombre">{detalle.producto?.nombre ?? "Sin nombre"}</div>
          <div className="producto-marca text-muted">{detalle.producto?.marca}</div>
        </div>
      </td>

      <td>
        <div className="cantidad-control flex items-center gap-2">
          <button
            className="btn btn-sm"
            onClick={() => onChange(cantidad - 1)}
            disabled={cantidad <= 1 || updating}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => onChange(Number(e.target.value))}
            className="border rounded w-16 text-center"
          />
          <button
            className="btn btn-sm"
            onClick={() => onChange(cantidad + 1)}
            disabled={updating}
          >
            +
          </button>
        </div>
      </td>

      <td>
        {tieneDescuento ? (
          <div>
            <p className={styles["precio-original"]}>S/ {Number(detalle.precio_original).toFixed(2)}</p>
            <p className={styles["precio-final"]}>S/ {precioUnit.toFixed(2)}</p>
          </div>
        ) : (
          <p className="precio-final">S/ {precioUnit.toFixed(2)}</p>
        )}
      </td>

      <td>S/ {subtotal.toFixed(2)}</td>

      <td>
        <button className="btn btn-danger btn-sm" onClick={handleEliminar}>
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default CarritoItem;

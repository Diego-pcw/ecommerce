import React, { useState, useEffect } from 'react';
import type { CarritoDetalle } from '../../types/CarritoDetalle';
import { useCarritoContext } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import styles from '../../styles/carritos/Carrito.module.css';
import '../../styles/carritos/carrito.shared.css'; // Importamos el shared
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';

interface Props {
  detalle: CarritoDetalle;
}

const CarritoItem: React.FC<Props> = ({ detalle }) => {
  const { actualizarCantidad, eliminarProducto } = useCarritoContext();
  const { push } = useToast();
  const [cantidad, setCantidad] = useState<number>(Number(detalle.cantidad));
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const onChange = async (value: number) => {
    if (value < 1) return;
    setCantidad(value);
    setUpdating(true);
    try {
      await actualizarCantidad(detalle.producto_id, value);
      push(`Cantidad de ${detalle.producto?.nombre ?? 'producto'} actualizada.`, 'success');
    } catch (err) {
      console.error(err);
      setCantidad(Number(detalle.cantidad));
      push('No se pudo actualizar la cantidad.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleEliminar = async () => {
    try {
      await eliminarProducto(detalle.producto_id);
      push(`${detalle.producto?.nombre ?? 'Producto'} eliminado del carrito.`, 'warning');
    } catch (err) {
      console.error(err);
      push('Error al eliminar el producto.', 'error');
    }
  };

  const precioUnit = Number(detalle.precio_unitario);
  const subtotal = Number(detalle.cantidad) * precioUnit;

  const tieneDescuento =
    detalle.precio_original && detalle.precio_original > detalle.precio_unitario;

  return (
    <tr>
      <td>
        <div className="cart-item-info">
          <img
            src={
              detalle.producto?.imagenes?.[0]?.url ||
              'https://placehold.co/80x80/f3f4f6/9ca3af?text=Biker'
            }
            alt={detalle.producto?.nombre}
            className="cart-item-image"
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=Error')}
          />
          <div className="cart-item-details">
            <h3>{detalle.producto?.nombre ?? 'Sin nombre'}</h3>
            <p>{detalle.producto?.marca}</p>
          </div>
        </div>
      </td>

      <td>
        <div className="cart-quantity-control">
          <button
            className="btn btn-outline btn-small"
            onClick={() => onChange(cantidad - 1)}
            disabled={cantidad <= 1 || updating}
          >
            <Minus size={14} />
          </button>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={updating}
          />
          <button
            className="btn btn-outline btn-small"
            onClick={() => onChange(cantidad + 1)}
            disabled={updating}
          >
            <Plus size={14} />
          </button>
        </div>
      </td>

      <td>
        {tieneDescuento ? (
          <div>
            <p className={styles.priceOriginal}>
              S/ {Number(detalle.precio_original).toFixed(2)}
            </p>
            <p className={styles.priceFinalWithDiscount}>
              S/ {precioUnit.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className={styles.priceFinal}>S/ {precioUnit.toFixed(2)}</p>
        )}
      </td>

      <td>
        <strong>S/ {subtotal.toFixed(2)}</strong>
      </td>

      <td>
        <button
          className="btn btn-danger btn-small"
          onClick={handleEliminar}
          title="Eliminar"
        >
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <Trash2 size={14} style={{ opacity: updating ? 0.4 : 1 }} />
            {updating && (
              <Loader2
                size={12}
                className="animate-spin"
                style={{ position: 'absolute' }}
              />
            )}
          </span>
        </button>
      </td>
    </tr>
  );
};

export default CarritoItem;
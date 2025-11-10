import React, { useState } from 'react';
import { useCarritoContext } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import type { ProductoListItem } from '../../types/Producto';
import { Loader2, ShoppingCart, Tag } from 'lucide-react';

import styles from '../../styles/carritos/Carrito.module.css'; // ✅ RUTA CORREGIDA
import '../../styles/productos/productos.shared.css';

/**
 * 🧱 Tarjeta individual de producto con botón "Agregar al carrito"
 * Reutilizable en listados, secciones o vistas personalizadas.
 */
interface Props {
  producto: ProductoListItem;
  mostrarPrecio?: boolean; // ✅ Nueva prop opcional
}

const ProductoCard: React.FC<Props> = ({ producto, mostrarPrecio = true }) => {
  const { agregarProducto } = useCarritoContext();
  const { push } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAgregar = async () => {
    if (adding) return;
    try {
      setAdding(true);
      await agregarProducto({
        producto_id: producto.id,
        cantidad: 1,
      });
      push('✅ Producto agregado al carrito', 'success');
    } catch (err) {
      console.error('Error al agregar producto:', err);
      push('❌ No se pudo agregar el producto', 'error');
    } finally {
      setAdding(false);
    }
  };

  const tieneDescuento =
    producto.promocion_vigente &&
    Number(producto.promocion_vigente.valor || 0) > 0;

  return (
    <article className="admin-card-item">
      {tieneDescuento && (
    <span className="product-discount-badge">
      <Tag size={12} />
      {producto.promocion_vigente?.tipo === 'percent'
        ? `${producto.promocion_vigente?.valor}% OFF`
        : `S/ ${producto.promocion_vigente?.valor} OFF`}
    </span>
  )}

      <div className="admin-card-info">
        <div className="product-card-content">
          {producto.imagenes?.[0] ? (
            <img
              src={producto.imagenes[0].url}
              alt={producto.nombre}
              className="product-card-image"
            />
          ) : (
            // Placeholder si no hay imagen
            <div
              className="product-card-image"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-disabled)',
              }}
            >
              Sin imagen
            </div>
          )}
          <h2>{producto.nombre}</h2>
          <p>{producto.categoria as string}</p>
        </div>
      </div>

      {/* ✅ Mostrar el precio solo si mostrarPrecio es true */}
      {mostrarPrecio && (
        <div className="product-price-container">
          {tieneDescuento ? (
            <>
              {/* ✅ Clases del CSS Module corregido */}
              <p className={styles.priceOriginal}>
                S/ {Number(producto.precio_original).toFixed(2)}
              </p>
              <p className={styles.priceFinalWithDiscount}>
                S/ {Number(producto.precio_final).toFixed(2)}
              </p>
            </>
          ) : (
            <p className={styles.priceFinal}>
              S/ {Number(producto.precio_final ?? producto.precio_original).toFixed(2)}
            </p>
          )}
        </div>
      )}

      {producto.promocion_vigente && (
        <div style={{ padding: '0 1.5rem 1rem' }}>
          <span
            className="status-badge"
            style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}
          >
            {producto.promocion_vigente.titulo} 🔖
          </span>
        </div>
      )}

      <div className="admin-card-actions">
        <button
          onClick={handleAgregar}
          disabled={adding}
          className="btn btn-success" // Usamos btn-success para "Agregar"
        >
          {adding ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ShoppingCart size={16} />
          )}
          {adding ? 'Agregando...' : 'Agregar'}
        </button>
      </div>
    </article>
  );
};

export default ProductoCard;
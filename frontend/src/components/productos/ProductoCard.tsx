import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCarritoContext } from '../../context/CarritoContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import type { ProductoListItem } from '../../types/Producto.ts';
import { Loader2, ShoppingCart, Tag, Eye } from 'lucide-react';

import styles from '../../styles/carritos/Carrito.module.css';
import '../../styles/productos/productos.shared.css';

interface Props {
  producto: ProductoListItem;
  mostrarPrecio?: boolean;
}

const ProductoCard: React.FC<Props> = ({ producto, mostrarPrecio = true }) => {

  const { agregarProducto } = useCarritoContext();
  
  const { push } = useToast();
  const [adding, setAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

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
    <article
      className="admin-card-item"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity .15s' }}
    >
      {tieneDescuento && (
        <span className="product-discount-badge">
          <Tag size={12} />
          {producto.promocion_vigente?.tipo === 'percent'
            ? `${producto.promocion_vigente?.valor}% OFF`
            : `S/ ${producto.promocion_vigente?.valor} OFF`}
        </span>
      )}

      <div className="admin-card-info">
        {/* ✨ Hacemos que toda la info sea un link al detalle */}
        <Link
          to={`/productos/${producto.id}`}
          className="product-card-content"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          {producto.imagenes?.[0] ? (
            <img
              src={producto.imagenes[0].url}
              alt={producto.nombre}
              className="product-card-image"
            />
          ) : (
            <div className="product-card-image product-card-placeholder">
              Sin imagen
            </div>
          )}
          <h2>{producto.nombre}</h2>
          <p>{producto.categoria as string}</p>
        </Link>
      </div>

      {mostrarPrecio && (
        <div className="product-price-container">
          {tieneDescuento ? (
            <>
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

      <div className="admin-card-actions">
        {/* ✨ Botón Ver Detalle (Compacto) */}
        <Link
          to={`/productos/${producto.id}`}
          className="btn btn-outline btn-icon-only"
          title="Ver detalles"
        >
          <Eye size={20} />
        </Link>

        {/* ✨ Botón Agregar (Expandido) */}
        <button
          onClick={handleAgregar}
          disabled={adding}
          className="btn btn-success"
          style={{ flex: 1 }}
        >
          <span
            className="icon-wrapper"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {adding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShoppingCart size={16} />
            )}
            {adding ? '...' : 'Agregar'}
          </span>
        </button>
      </div>
    </article>
  );
};

export default ProductoCard;
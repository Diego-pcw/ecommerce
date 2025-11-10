import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service.ts';
import type { Producto } from '../../types/Producto.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import ResenaForm from '../resenas/ResenaForm.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import styles from '../../styles/carritos/Carrito.module.css';
import '../../styles/productos/productos.shared.css';
import {
  ArrowLeft,
  MessageSquare,
  Package,
  Tag,
  Hash,
  Type,
  FileText,
  CheckCircle,
  Box,
  CircleDollarSign,
  Loader2,
} from 'lucide-react';

const ProductoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState(''); // Mantenemos tu lógica de error
  const [mostrarFormResena, setMostrarFormResena] = useState(false);
  const [loading, setLoading] = useState(true); // ✨ Loading state
  const { push } = useToast(); // ✨ Toast

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true); // ✨
        if (id) {
          const data = await productoService.obtenerPorId(Number(id));
          setProducto(data);
          document.title = `Detalle: ${data.nombre} | Panel`; // ✨
        }
      } catch (err) {
        console.error('Error al obtener producto:', err);
        const errorMsg = 'Error al obtener los detalles del producto ❌';
        setError(errorMsg);
        push(errorMsg, 'error'); // ✨
      } finally {
        setLoading(false); // ✨
      }
    };
    fetchProducto();
  }, [id, push]); // ✨

  if (loading) // ✨
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando producto...
      </div>
    );
  
  if (error) return <p className="admin-list-empty">{error}</p>; // ✨
  if (!producto) return <p className="admin-list-empty">No se encontró el producto.</p>; // ✨

  const precio = producto.precio_final ?? 0;
  const categoriaNombre =
    typeof producto.categoria === 'string'
      ? producto.categoria
      : producto.categoria?.nombre ?? '—';

  // Mantenemos tu lógica de estado
  const estado =
    producto.estado?.toLowerCase() === 'activo'
      ? 'activo'
      : producto.estado?.toLowerCase() === 'inactivo'
      ? 'inactivo'
      : 'INACTIVO'; // fallback

  const tieneDescuento =
    producto.promocion_vigente &&
    Number(producto.promocion_vigente.valor || 0) > 0;

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>{producto.nombre}</h2>
        <div className="admin-detail-actions">
          <button
            onClick={() => navigate('/productos')}
            className="btn btn-outline"
          >
            <ArrowLeft size={16} />
            Volver a la lista
          </button>
        </div>
      </div>

      {/* 🖼️ Galería de imágenes */}
      {producto.imagenes && producto.imagenes.length > 0 ? (
        <div className="product-gallery">
          {producto.imagenes.map((img) => (
            <img key={img.id} src={img.url} alt={producto.nombre} />
          ))}
        </div>
      ) : (
        <p className="product-gallery-empty">No hay imágenes disponibles.</p>
      )}

      {/* 📋 Detalles del producto */}
      <div className="admin-detail-box">
        <div className="admin-detail-item">
          <strong><Hash size={14} /> ID</strong>
          <span>{producto.id}</span>
        </div>
        <div className="admin-detail-item">
          <strong><Type size={14} /> Marca</strong>
          <span>{producto.marca ?? 'Sin marca'}</span>
        </div>
        <div className="admin-detail-item">
          <strong><Package size={14} /> Categoría</strong>
          <span>{categoriaNombre}</span>
        </div>
        <div className="admin-detail-item">
          <strong><Box size={14} /> Stock</strong>
          <span>{producto.stock ?? 0}</span>
        </div>
        <div className="admin-detail-item">
          <strong><CheckCircle size={14} /> Estado</strong>
          <span className={`status-badge ${estado}`}>
            {producto.estado}
          </span>
        </div>

        {/* Precio */}
        <div className="admin-detail-item product-price-detail">
          <strong><CircleDollarSign size={14} /> Precio</strong>
          {tieneDescuento ? (
            <>
              <p className={styles.priceOriginal} style={{ color: '#fff', opacity: 0.8 }}>
                S/ {Number(producto.precio_original).toFixed(2)}
              </p>
              <span>S/ {precio.toFixed(2)}</span>
            </>
          ) : (
            <span>S/ {precio.toFixed(2)}</span>
          )}
        </div>

        {/* Descripción */}
        <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
          <strong><FileText size={14} /> Descripción</strong>
          <span>{producto.descripcion ?? 'Sin descripción'}</span>
        </div>

        {/* 🎟️ Promoción vigente */}
        {producto.promocion_vigente && (
          <div className="admin-detail-item product-promo-info" style={{ gridColumn: '1 / -1' }}>
            <strong><Tag size={14} /> Promoción Vigente</strong>
            <span>
              {producto.promocion_vigente.titulo} (
              {producto.promocion_vigente.tipo === 'percent'
                ? `${producto.promocion_vigente.valor}%`
                : `S/ ${producto.promocion_vigente.valor}`}
              )
            </span>
            <p>
              Vigencia: {new Date(producto.promocion_vigente.fecha_inicio).toLocaleDateString()} –{' '}
              {new Date(producto.promocion_vigente.fecha_fin).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* 🧭 Acciones */}
        <div className="admin-form-actions" style={{ borderTop: 'none', marginTop: 0, gridColumn: '1 / -1' }}>
          <button
            onClick={() => {
              if (!user) {
                push("Debes iniciar sesión para dejar una reseña", "warning"); // ✨
                return navigate('/login');
              }
              setMostrarFormResena(!mostrarFormResena);
            }}
            className="btn btn-primary" // Botón amarillo
          >
            <MessageSquare size={16} />
            {mostrarFormResena ? "Ocultar reseña" : "✍️ Dejar reseña"}
          </button>
        </div>

        {/* 📝 Formulario de reseña (solo se muestra si el usuario está logueado y activó el botón) */}
        {mostrarFormResena && (
          <div style={{ gridColumn: '1 / -1' }}>
            <ResenaForm productoId={Number(id)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetail;
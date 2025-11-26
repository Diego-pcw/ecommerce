import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service.ts';
import { useCarritoContext } from '../../context/CarritoContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import type { Producto } from '../../types/Producto.ts';
import ResenasPublicList from '../../pages/resenas/ResenasPublicList.tsx'; // Reutilizamos la lista
import ResenaForm from '../../pages/resenas/ResenaForm.tsx'; // Reutilizamos el formulario
import {
  Loader2,
  ShoppingCart,
  Star,
  Check,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
} from 'lucide-react';

import '../../styles/productos/catalogo.shared.css';

const CatalogoProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { agregarProducto } = useCarritoContext();

  const { push } = useToast();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  
  // Estado para la galería
  const [mainImage, setMainImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'descripcion' | 'resenas'>('descripcion');

  // Ref para el zoom
  const imageRef = useRef<HTMLImageElement>(null);

  // 1️⃣ Cargar Producto
  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) return;
      try {
        setLoading(true);
        
        const data = await productoService.obtenerPorId(Number(id));
        setProducto(data);
        
        // Establecer imagen principal inicial
        if (data.imagenes && data.imagenes.length > 0) {
          setMainImage(data.imagenes[0].url);
        }
        document.title = `${data.nombre} | Mi Tienda`;
      } catch (error) {
        console.error('Error cargando producto:', error);
        push('No se pudo cargar el producto.', 'error');
        navigate('/productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
    window.scrollTo(0, 0);
  }, [id, navigate, push]);

  // 2️⃣ Lógica de Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    if (imageRef.current) {
      imageRef.current.style.transformOrigin = `${x}% ${y}%`;
      imageRef.current.style.transform = 'scale(2)'; // Nivel de zoom
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1)';
      imageRef.current.style.transformOrigin = 'center center';
    }
  };

  // 3️⃣ Agregar al Carrito
  const handleAddToCart = async () => {
    if (!producto) return;
    if (adding) return;
    
    setAdding(true);
    try {
      await agregarProducto({
        producto_id: producto.id,
        cantidad: cantidad,
      });
      push(`Agregado: ${cantidad} x ${producto.nombre}`, 'success');
    } catch (error) {
      console.error(error);
      push('Error al agregar al carrito', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );

  if (!producto) return null;

  // Calcular precios y descuentos
  const tieneDescuento =
    producto.promocion_vigente && Number(producto.promocion_vigente.valor) > 0;
  const precioFinal = Number(producto.precio_final);
  const precioOriginal = Number(producto.precio_original);
  const porcentajeDesc = tieneDescuento && producto.promocion_vigente?.tipo === 'percent' 
      ? producto.promocion_vigente.valor 
      : Math.round(((precioOriginal - precioFinal) / precioOriginal) * 100);

  return (
    <div className="product-detail-wrapper">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline"
        style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0 }}
      >
        <ArrowLeft size={20} /> Volver al catálogo
      </button>

      <div className="product-detail-grid">
        {/* 🖼️ COLUMNA IZQUIERDA: GALERÍA */}
        <div className="gallery-container">
          <div 
            className="main-image-frame"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={imageRef}
              src={mainImage || 'https://placehold.co/600x600/f3f4f6/9ca3af?text=Sin+Imagen'}
              alt={producto.nombre}
              className="main-image"
            />
            {tieneDescuento && (
              <div className="product-discount-badge" style={{top: '1rem', left: '1rem', right: 'auto'}}>
                -{porcentajeDesc}%
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {producto.imagenes && producto.imagenes.length > 0 && (
            <div className="thumbnails-row">
              {producto.imagenes.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="thumbnail"
                  className={`thumbnail ${mainImage === img.url ? 'active' : ''}`}
                  onMouseEnter={() => setMainImage(img.url)}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 📝 COLUMNA DERECHA: INFO */}
        <div className="product-info-col">
          <div>
            <p className="product-brand">{producto.marca || 'Genérico'}</p>
            <h1 className="product-title">{producto.nombre}</h1>
            <p style={{color: 'var(--color-text-secondary)', marginTop: '0.5rem'}}>
              Categoría: <strong>{typeof producto.categoria === 'string' ? producto.categoria : producto.categoria?.nombre}</strong>
            </p>
            
            {/* Rating Simulado (o real si viene del back) */}
            <div className="product-rating" style={{marginTop: '0.5rem'}}>
              <Star fill="#fbbf24" strokeWidth={0} />
              <Star fill="#fbbf24" strokeWidth={0} />
              <Star fill="#fbbf24" strokeWidth={0} />
              <Star fill="#fbbf24" strokeWidth={0} />
              <Star fill="#e5e7eb" strokeWidth={0} />
              <span style={{color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>(12 reseñas)</span>
            </div>
          </div>

          {/* Precio */}
          <div className="product-price-block">
            <span className="price-current">S/ {precioFinal.toFixed(2)}</span>
            {tieneDescuento && (
              <>
                <span className="price-old">S/ {precioOriginal.toFixed(2)}</span>
                <span className="discount-tag">OFERTA</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="stock-status">
            {(producto.stock ?? 0) > 5 ? (
              <span className="stock-in"><Check size={16} /> Disponible en stock</span>
            ) : (producto.stock ?? 0) > 0 ? (
              <span className="stock-low"><Check size={16} /> ¡Últimas {producto.stock} unidades!</span>
            ) : (
              <span className="stock-out">Agotado</span>
            )}
          </div>

          {/* Acciones */}
          <div className="actions-row">
            <div className="quantity-selector">
              <button 
                className="qty-btn" 
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                className="qty-input" 
                value={cantidad} 
                readOnly 
              />
              <button 
                className="qty-btn" 
                onClick={() => setCantidad(c => Math.min((producto.stock ?? 10), c + 1))}
                disabled={cantidad >= (producto.stock ?? 0)}
              >
                <Plus size={16} />
              </button>
            </div>

            <button 
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={adding || (producto.stock ?? 0) === 0}
            >
              {adding ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
              {adding ? 'Añadiendo...' : 'Añadir al Carrito'}
            </button>
          </div>

          {/* Beneficios */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <Truck size={18} /> Envíos a todo el país
            </div>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <ShieldCheck size={18} /> Garantía de 6 meses
            </div>
          </div>
        </div>
      </div>

      {/* 📑 TABS: DESCRIPCIÓN Y RESEÑAS */}
      <div className="product-tabs">
        <div className="tab-headers">
          <button 
            className={`tab-btn ${activeTab === 'descripcion' ? 'active' : ''}`}
            onClick={() => setActiveTab('descripcion')}
          >
            Descripción
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resenas' ? 'active' : ''}`}
            onClick={() => setActiveTab('resenas')}
          >
            Reseñas y Opiniones
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'descripcion' && (
            <div className="product-description animate-fadeIn">
              <p>{producto.descripcion || 'Este producto no tiene una descripción detallada.'}</p>
            </div>
          )}

          {activeTab === 'resenas' && (
            <div className="animate-fadeIn">
              <div style={{maxWidth: '800px'}}>
                <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700'}}>Deja tu opinión</h3>
                
                <ResenaForm productoId={producto.id} />
                
                <div style={{marginTop: '3rem'}}>
                   {/* Aquí podrías filtrar las reseñas solo para este producto si tu componente lo soporta, 
                       o crear un componente específico ResenasListByProduct */}
                   <p style={{color: 'var(--color-text-secondary)', fontStyle: 'italic'}}>
                     Mostrando opiniones recientes de la tienda...
                   </p>
                   
                   <ResenasPublicList /> 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogoProductDetail;
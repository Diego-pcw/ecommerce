import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import type { ProductoListItem } from '../../types/Producto';
import { useCarritoContext } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import '../../styles/productos/productosmix.shared.css';

const ProductosMix: React.FC = () => {
  const [novedades, setNovedades] = useState<ProductoListItem[]>([]);
  const [ofertas, setOfertas] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { agregarProducto } = useCarritoContext();

  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Obtener Novedades (Ordenados por ID desc, límite 3)
        // Asumimos que 'recent' o 'id_desc' es el default del backend
        const resNew = await productoService.obtenerTodos({
          page: 1,
          per_page: 3,
          sort_by: 'id',
          sort_dir: 'desc',
          estado: 'activo',
        });

        // 2️⃣ Obtener Ofertas (Límite 3)
        const resSale = await productoService.obtenerConOfertas();
        // Si el servicio devuelve todo, cortamos a 3
        const saleData = Array.isArray(resSale) ? resSale.slice(0, 3) : [];

        setNovedades(resNew.data ?? []);
        setOfertas(saleData);
      } catch (error) {
        console.error('Error cargando mix de productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAgregar = async (e: React.MouseEvent, producto: ProductoListItem) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await agregarProducto({
        producto_id: producto.id,
        cantidad: 1,
      });
      push(`¡${producto.nombre} añadido!`, 'success');
    } catch (error) {
      push('Error al añadir al carrito', 'error');
    }
  };

  // Renderizador de Tarjeta Mini (Reutilizable para ambas columnas)
  const renderCard = (prod: ProductoListItem, type: 'new' | 'sale') => {
    const tieneDescuento =
      prod.promocion_vigente && Number(prod.promocion_vigente.valor) > 0;

    return (
      <div
        key={prod.id}
        className="mix-card"
        onClick={() => navigate(`/productos/${prod.id}`)}
        role="button"
        tabIndex={0}
      >
        {/* Imagen */}
        <div className="mix-card-img-wrapper">
          {prod.imagenes?.[0] ? (
            <img
              src={prod.imagenes[0].url}
              alt={prod.nombre}
              className="mix-card-img"
              loading="lazy"
            />
          ) : (
            <div style={{width: '100%', height: '100%', background: '#eee'}} />
          )}
          
          {/* Badge */}
          {type === 'new' && <span className="badge-mix">NUEVO</span>}
          {type === 'sale' && tieneDescuento && (
            <span className="badge-mix">
              -{prod.promocion_vigente?.valor}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mix-card-info">
          <div>
            <div className="mix-card-cat">
              {typeof prod.categoria === 'string' ? prod.categoria : prod.categoria?.nombre}
            </div>
            <h3 className="mix-card-name">{prod.nombre}</h3>
          </div>

          <div className="mix-price-row">
            {type === 'sale' && tieneDescuento ? (
              <>
                <span className="mix-price-main" style={{color: '#f43f5e'}}>
                  S/ {Number(prod.precio_final).toFixed(2)}
                </span>
                <span className="mix-price-old">
                  S/ {Number(prod.precio_original).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="mix-price-main">
                S/ {Number(prod.precio_final ?? prod.precio_original).toFixed(2)}
              </span>
            )}
          </div>

          <button 
            className="btn-mix-action"
            onClick={(e) => handleAgregar(e, prod)}
            title="Añadir al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mix-loader">
        <Loader2 className="animate-spin" size={48} color="#888" />
      </div>
    );
  }

  if (novedades.length === 0 && ofertas.length === 0) return null;

  return (
    <section className="mix-section">
      <div className="mix-container">
        <div className="mix-grid-layout">
          
          {/* COLUMNA 1: NOVEDADES (AZUL) */}
          <div className="mix-column theme-new">
            <div className="mix-header">
              <h2 className="mix-title">
                <Sparkles size={28} /> Recién Llegados
              </h2>
              <Link to="/catalogo?sort_by=recent" className="mix-link">
                Ver todo <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mix-list">
              {novedades.map((p) => renderCard(p, 'new'))}
            </div>
          </div>

          {/* COLUMNA 2: OFERTAS (ROJO) */}
          <div className="mix-column theme-sale">
            <div className="mix-header">
              <h2 className="mix-title">
                <Flame size={28} /> Ofertas Relámpago
              </h2>
              <Link to="/promociones" className="mix-link">
                Ver todo <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mix-list">
              {ofertas.length > 0 ? (
                ofertas.map((p) => renderCard(p, 'sale'))
              ) : (
                <p style={{fontStyle: 'italic', color: '#888'}}>No hay ofertas activas por el momento.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductosMix;
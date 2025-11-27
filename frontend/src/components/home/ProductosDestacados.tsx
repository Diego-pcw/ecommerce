import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import type { ProductoListItem } from '../../types/Producto';
import { useCarritoContext } from '../../context/CarritoContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  ShoppingCart,
  Eye,
  ArrowRight,
  Flame,
  Loader2,
  Tag,
} from 'lucide-react';
import '../../styles/productos/productosdestac.shared.css';

const ProductosDestacados: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { agregarProducto } = useCarritoContext();
  const { push } = useToast();
  const navigate = useNavigate();

  // Estado para controlar qué botón de "agregar" está cargando (por ID de producto)
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        // Solicitamos los productos.
        // Simulamos "Los más valorados" pidiendo los primeros 6 activos.
        // Idealmente tu backend tendría un endpoint sort_by=rating
        const res = await productoService.obtenerTodos({
          page: 1,
          per_page: 6,
          estado: 'activo',
        });

        const data = res.data ?? [];
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  const handleAgregarRapido = async (
    e: React.MouseEvent,
    producto: ProductoListItem
  ) => {
    e.preventDefault(); // Prevenir navegación al detalle
    e.stopPropagation();
    
    if (addingId) return; // Evitar doble clic
    
    try {
      setAddingId(producto.id);
      await agregarProducto({
        producto_id: producto.id,
        cantidad: 1,
      });
      push(`¡${producto.nombre} agregado al carrito!`, 'success');
    } catch (error) {
      console.error(error);
      push('No se pudo agregar al carrito.', 'error');
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="featured-loader">
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  if (productos.length === 0) return null;

  return (
    <section className="featured-products-section">
      <div className="featured-container">
        {/* Cabecera Atractiva */}
        <div className="featured-header">
          <div className="featured-title-group">
            <h2 className="featured-title">
              Top <span>Ventas</span> <Flame fill="#ff3d00" strokeWidth={0} size={32} />
            </h2>
            <p className="featured-subtitle">
              Los favoritos de la comunidad biker. Calidad comprobada y precios increíbles.
            </p>
          </div>
          <Link to="/catalogo" className="btn-view-all">
            Ver todo el catálogo <ArrowRight size={18} />
          </Link>
        </div>

        {/* Grid de Tarjetas "Pop" */}
        <div className="featured-grid">
          {productos.map((prod) => {
            const tieneDescuento =
              prod.promocion_vigente && Number(prod.promocion_vigente.valor) > 0;
            
            // Simulamos un rating visual para el demo (entre 4.5 y 5.0)
            // En producción, esto vendría de prod.rating
            const ratingSimulado = (4.5 + Math.random() * 0.5).toFixed(1);
            const ventasSimuladas = Math.floor(Math.random() * 500) + 50;

            return (
              <div 
                key={prod.id} 
                className="featured-card"
                onClick={() => navigate(`/productos/${prod.id}`)} // Toda la tarjeta es clickable
                role="button"
                tabIndex={0}
              >
                {/* Imagen */}
                <div className="featured-image-wrapper">
                  {prod.imagenes?.[0] ? (
                    <img
                      src={prod.imagenes[0].url}
                      alt={prod.nombre}
                      className="featured-image"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="featured-image"
                      style={{
                        background: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                      }}
                    >
                      Sin imagen
                    </div>
                  )}

                  {/* Badges Flotantes */}
                  <div className="badge-overlay">
                    {tieneDescuento && (
                      <span className="badge-hot">
                        <Tag size={12} fill="white" /> -{prod.promocion_vigente?.valor}%
                      </span>
                    )}
                    <span className="badge-rating">
                      {ratingSimulado} <Star size={10} />
                    </span>
                  </div>
                </div>

                {/* Información */}
                <div className="featured-info">
                  <span className="featured-category">
                    {typeof prod.categoria === 'string' ? prod.categoria : prod.categoria?.nombre}
                  </span>
                  
                  <h3 className="featured-name" title={prod.nombre}>
                    {prod.nombre}
                  </h3>

                  <div style={{fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600}}>
                    🔥 {ventasSimuladas} vendidos recientemente
                  </div>

                  <div className="featured-price-row">
                    {tieneDescuento ? (
                      <>
                        <span className="price-main">
                          S/ {Number(prod.precio_final).toFixed(2)}
                        </span>
                        <span className="price-crossed">
                          S/ {Number(prod.precio_original).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="price-main">
                        S/ {Number(prod.precio_final ?? prod.precio_original).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Botones de Acción */}
                  <div className="featured-actions">
                    <button
                      className="btn-add-fast"
                      onClick={(e) => handleAgregarRapido(e, prod)}
                      disabled={addingId === prod.id}
                    >
                      {addingId === prod.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={18} />
                      )}
                      {addingId === prod.id ? '...' : 'Al Carrito'}
                    </button>
                    
                    <Link
                      to={`/productos/${prod.id}`}
                      className="btn-detail-icon"
                      title="Ver Detalles"
                      onClick={(e) => e.stopPropagation()} // Evita el doble click del contenedor
                    >
                      <Eye size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductosDestacados;
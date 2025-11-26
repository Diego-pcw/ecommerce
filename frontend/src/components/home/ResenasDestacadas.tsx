import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resenaService } from '../../services/resena.service.ts';
import type { Resena } from '../../types/Resena.ts'; // Asegúrate de tener este tipo o usa 'any' temporalmente
import { Star, Quote, ShoppingBag, Loader2, User } from 'lucide-react';
import '../../styles/resenas/resenadestac.shared.css';

const ResenasDestacadas: React.FC = () => {
  // Usamos 'any' si no tienes el tipo Resena exportado correctamente, idealmente impórtalo
  const [resenas, setResenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestacadas = async () => {
      try {
        setLoading(true);
        // Solicitamos reseñas aprobadas.
        // Idealmente el backend soportaría ?rating=5 o ?sort_by=rating
        // Si no, filtramos aquí en el frontend.
        const res = await resenaService.getAll({ estado: 'APROBADO', per_page: 50 });
        
        const allResenas = res.data ?? [];

        // 🔹 Lógica de Filtrado "Destacadas":
        // 1. Solo 4 o 5 estrellas
        // 2. Que tengan comentario (no vacías)
        // 3. Tomamos las 6 primeras (o aleatorias si prefieres)
        const destacadas = allResenas
          .filter((r: any) => r.rating >= 4 && r.comentario && r.comentario.length > 10)
          .slice(0, 6); // Máximo 6

        setResenas(destacadas);
      } catch (error) {
        console.error('Error al cargar reseñas destacadas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacadas();
  }, []);

  if (loading) {
    return (
      <div className="reviews-loader">
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  if (resenas.length === 0) return null; // No mostrar la sección si no hay reseñas top

  return (
    <section className="featured-reviews-section">
      <div className="featured-reviews-container">
        <div className="featured-reviews-header">
          <h2 className="featured-reviews-title">
            Lo que dicen nuestros <span>Clientes</span>
          </h2>
          <p className="featured-reviews-subtitle">
            La confianza de nuestra comunidad motera es nuestro mayor respaldo.
            Descubre sus experiencias.
          </p>
        </div>

        <div className="reviews-grid">
          {resenas.map((resena) => (
            <div key={resena.id} className="review-card-featured">
              <Quote size={48} className="quote-icon" />
              
              <div className="review-card-header">
                <div className="user-avatar-placeholder">
                  {resena.user?.name ? resena.user.name.charAt(0).toUpperCase() : <User size={24} />}
                </div>
                <div className="user-info">
                  <h4>{resena.user?.name || 'Cliente Anónimo'}</h4>
                  <div className="star-rating-static">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.round(resena.rating) ? 'filled' : 'empty'}
                        style={{
                          fill: i < Math.round(resena.rating) ? '#fbbf24' : 'none',
                          color: i < Math.round(resena.rating) ? '#fbbf24' : '#e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="review-body">
                <p className="review-text">"{resena.comentario}"</p>
              </div>

              {resena.producto && (
                <Link to={`/productos/${resena.producto.id}`} className="review-product-link">
                  <ShoppingBag size={16} />
                  <span>{resena.producto.nombre}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResenasDestacadas;
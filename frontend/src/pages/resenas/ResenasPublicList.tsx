import React, { useEffect, useState } from 'react';
import { resenaService } from '../../services/resena.service';
import { useToast } from '../../context/ToastContext';
import '../../styles/resenas/resena.shared.css';
import { Loader2, Star, MessageSquare } from 'lucide-react';

const ResenasPublicList: React.FC = () => {
  const { push } = useToast();
  const [resenas, setResenas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResenas = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        estado: 'APROBADO',
      };
      const data = await resenaService.getAll(params);
      setResenas(data.data ?? []);
      setPagina(data.current_page ?? 1);
      setTotalPaginas(data.last_page ?? 1);
    } catch (err) {
      console.error(err);
      push('Error al cargar reseñas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas(1);
  }, []);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="star-rating" style={{ fontSize: '1rem', gap: 0 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? 'star active' : 'star'}
          style={{
            fill:
              i < Math.round(rating)
                ? 'var(--color-primary)'
                : 'var(--color-border)',
            color:
              i < Math.round(rating)
                ? 'var(--color-primary)'
                : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="review-public-container">
      <h2 className="review-public-header">Opiniones de Nuestros Clientes</h2>

      {loading ? (
        <div className="loader-container">
          <Loader2 className="animate-spin" size={32} />
          Cargando reseñas...
        </div>
      ) : resenas.length === 0 ? (
        <p className="admin-list-empty">
          <MessageSquare size={40} />
          Aún no hay reseñas disponibles.
        </p>
      ) : (
        <ul className="review-card-grid">
          {resenas.map((r) => (
            <li key={r.id} className="review-card">
              <div className="review-card-header">
                <h3>{r.producto?.nombre ?? 'Producto desconocido'}</h3>
                <StarRating rating={r.rating} />
              </div>
              <p className="review-card-body">"{r.comentario}"</p>
              <p className="review-card-user">
                — {r.user?.name ?? 'Usuario anónimo'}
              </p>
            </li>
          ))}
        </ul>
      )}

      {totalPaginas > 1 && (
        <div className="pagination-container">
          <button
            className="btn"
            onClick={() => fetchResenas(pagina - 1)}
            disabled={pagina <= 1}
          >
            ◀ Anterior
          </button>
          <span>
            Página <strong>{pagina}</strong> de {totalPaginas}
          </span>
          <button
            className="btn"
            onClick={() => fetchResenas(pagina + 1)}
            disabled={pagina >= totalPaginas}
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ResenasPublicList;
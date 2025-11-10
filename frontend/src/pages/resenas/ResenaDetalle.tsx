import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { resenaService, type Resena } from '../../services/resena.service';
import '../../styles/resenas/resena.shared.css';
import {
  Loader2,
  Package,
  User,
  Star,
  FileText,
  CalendarDays,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

const ResenaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const navigate = useNavigate();
  const [resena, setResena] = useState<Resena | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetalle = async () => {
    if (!id) {
      push('ID de reseña inválido.', 'error');
      setLoading(false);
      navigate('/resenas'); // Volver a la lista
      return;
    }

    try {
      setLoading(true);
      const data = await resenaService.getById(Number(id));
      const resenaData = data?.data || data;
      setResena(resenaData);
      document.title = `Reseña de ${
        resenaData.producto?.nombre || 'Producto'
      } | Panel`;
    } catch (err) {
      console.error('❌ Error al obtener detalle de reseña:', err);
      push('No se pudo cargar la reseña.', 'error');
      setResena(null);
      navigate('/resenas'); // Volver a la lista
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando reseña...
      </div>
    );
  if (!resena)
    return <p className="admin-list-empty">Reseña no encontrada.</p>;

  const formatDate = (fecha?: string) =>
    fecha
      ? new Date(fecha).toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="star-rating" style={{ fontSize: '1.25rem', gap: 0 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
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
      <span className="star-value" style={{ fontSize: '1rem' }}>
        ({rating}/5)
      </span>
    </div>
  );

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>Detalle de Reseña</h2>
        <div className="admin-detail-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/resenas')}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      <div className="admin-detail-box">
        <div className="admin-detail-item">
          <strong>
            <Package size={14} /> Producto
          </strong>
          <span>{resena.producto?.nombre || 'Producto desconocido'}</span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <User size={14} /> Usuario
          </strong>
          <span>{resena.user?.name || 'Desconocido'}</span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <CheckCircle size={14} /> Estado
          </strong>
          <span className={`status-badge ${resena.estado.toLowerCase()}`}>
            {resena.estado.toUpperCase()}
          </span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <Star size={14} /> Puntuación
          </strong>
          <StarRating rating={resena.rating} />
        </div>

        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Creado el
          </strong>
          <span>{formatDate(resena.created_at)}</span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Última actualización
          </strong>
          <span>{formatDate(resena.updated_at)}</span>
        </div>

        {resena.titulo && (
          <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
            <strong>Título:</strong>
            <span>{resena.titulo}</span>
          </div>
        )}

        <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
          <strong>
            <FileText size={14} /> Comentario
          </strong>
          <span>{resena.comentario || 'Sin comentario disponible.'}</span>
        </div>
      </div>
    </div>
  );
};

export default ResenaDetalle;
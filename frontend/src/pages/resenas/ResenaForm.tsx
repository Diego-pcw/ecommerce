import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { resenaService } from '../../services/resena.service';
import '../../styles/resenas/resena.shared.css';
import { Loader2, Send } from 'lucide-react';

interface ResenaFormProps {
  productoId: number;
  onSuccess?: () => void;
}

const ResenaForm: React.FC<ResenaFormProps> = ({ productoId, onSuccess }) => {
  const { user } = useAuth();
  const { push } = useToast();
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      push('Debes iniciar sesión para dejar una reseña.', 'warning');
      return;
    }
    if (!productoId) {
      push('Error: producto no identificado.', 'error');
      return;
    }
    if (!comentario.trim()) {
      push('Por favor, escribe un comentario.', 'warning');
      return;
    }

    try {
      setLoading(true);
      await resenaService.create({
        producto_id: productoId,
        rating: puntuacion,
        comentario: comentario.trim(),
      });

      push('✅ Reseña enviada. Espera aprobación del administrador.', 'success');
      setComentario('');
      setPuntuacion(5);
      onSuccess?.();
    } catch (err: any) {
      console.error('❌ Error al enviar reseña:', err);
      const mensaje =
        err.response?.data?.message ||
        'No se pudo enviar la reseña. Es posible que ya hayas enviado una para este producto.';
      push(mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form-container" onSubmit={handleSubmit}>
      <h3>Escribe una reseña</h3>

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`star ${puntuacion >= n ? 'active' : ''}`}
            onClick={() => !loading && setPuntuacion(n)}
            role="button"
            aria-label={`Puntuación ${n}`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className="review-form-textarea" // Hereda estilos base de theme.css
        placeholder="Comparte tu experiencia..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={4}
        maxLength={500}
        disabled={loading}
      />

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={18} />
        )}
        {loading ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  );
};

export default ResenaForm;
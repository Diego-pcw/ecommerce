import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contact.service';
import type { ContactMessage } from '../../types/ContactMessage';
import { useToast } from '../../context/ToastContext';
import { Loader2, ArrowLeft } from 'lucide-react';
import '../../styles/contactos/contacto.shared.css'; // Reutilizamos el CSS

const ContactDetailUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetalle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await contactService.getById(Number(id));
      setMensaje(data);
    } catch (err) {
      console.error(err);
      push('Error al cargar el mensaje.', 'error');
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
        Cargando...
      </div>
    );
  if (!mensaje)
    return <p className="admin-list-empty">No se encontró el mensaje.</p>;

  return (
    // Usamos el contenedor de detalle de admin para consistencia
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>Detalle de tu mensaje</h2>
        <div className="admin-detail-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/mi-cuenta/contactos')} // Asumiendo esta ruta
          >
            <ArrowLeft size={16} />
            Mis Mensajes
          </button>
        </div>
      </div>

      <div className="admin-detail-box">
        <div className="admin-detail-item">
          <strong>Estado:</strong>
          <span className={`status-badge ${mensaje.estado.toLowerCase()}`}>
            {mensaje.estado}
          </span>
        </div>

        <div className="message-user-box" style={{ gridColumn: '1 / -1' }}>
          <h4>Tu mensaje:</h4>
          <p>{mensaje.mensaje}</p>
          <small style={{ display: 'block', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
            Enviado el: {new Date(mensaje.created_at ?? '').toLocaleString('es-PE')}
          </small>
        </div>

        {mensaje.respuesta ? (
          <div className="message-response-box" style={{ gridColumn: '1 / -1' }}>
            <h4>Respuesta del equipo:</h4>
            <p>{mensaje.respuesta}</p>
            <small>
              Respondido el:{' '}
              {mensaje.fecha_respuesta
                ? new Date(mensaje.fecha_respuesta).toLocaleString('es-PE')
                : '—'}
            </small>
          </div>
        ) : (
          <div className="admin-list-empty" style={{ gridColumn: '1 / -1' }}>
            Aún no hemos respondido tu mensaje. Te notificaremos pronto.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetailUser;
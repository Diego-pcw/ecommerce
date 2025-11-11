import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../../services/contact.service.ts'; // Con .ts
import type { ContactMessage } from '../../types/ContactMessage.ts'; // Con .ts
import { useToast } from '../../context/ToastContext.tsx'; // Con .tsx
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  CalendarDays,
  CheckCircle,
  Send,
} from 'lucide-react';
import '../../styles/contactos/contacto.shared.css';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();

  const [mensaje, setMensaje] = useState<ContactMessage | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchDetalle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await contactService.getById(Number(id));
      setMensaje(data);
      document.title = `Mensaje de ${data.nombre} | Panel`;
    } catch (err) {
      console.error(err);
      push('Error al cargar mensaje.', 'error');
      navigate('/admin/contactos');
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async () => {
    if (!id || !respuesta.trim()) {
      push('La respuesta no puede estar vacía.', 'warning');
      return;
    }
    try {
      setSending(true);
      await contactService.update(Number(id), { respuesta });
      push('Respuesta enviada correctamente.', 'success');
      fetchDetalle(); // Recargar los detalles
      setRespuesta(''); // Limpiar el textarea
    } catch (err) {
      console.error(err);
      push('Error al responder mensaje.', 'error');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('es-PE', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando mensaje...
      </div>
    );

  if (!mensaje)
    return <p className="admin-list-empty">No se encontró el mensaje.</p>;

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>📬 Detalle del Mensaje</h2>
        <div className="admin-detail-actions">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      <div className="admin-detail-box">
        <div className="admin-detail-info-grid">
          <div className="admin-detail-item">
            <strong>
              <User size={14} /> Nombre
            </strong>
            <span>{mensaje.nombre}</span>
          </div>
          <div className="admin-detail-item">
            <strong>
              <Mail size={14} /> Email
            </strong>
            <span>{mensaje.email}</span>
          </div>
          <div className="admin-detail-item">
            <strong>
              <Phone size={14} /> Teléfono
            </strong>
            <span>{mensaje.telefono || '—'}</span>
          </div>
          <div className="admin-detail-item">
            <strong>
              <MessageSquare size={14} /> Canal
            </strong>
            <span>{mensaje.canal_preferido}</span>
          </div>
          <div className="admin-detail-item">
            <strong>
              <CalendarDays size={14} /> Fecha
            </strong>
            <span>{formatDate(mensaje.created_at)}</span>
          </div>
          <div className="admin-detail-item">
            <strong>
              <CheckCircle size={14} /> Estado
            </strong>
            <span
              className={`status-badge ${mensaje.estado.toLowerCase()}`}
            >
              {mensaje.estado}
            </span>
          </div>
        </div>

        <div className="message-user-box">
          <h4>Mensaje del usuario:</h4>
          <p>{mensaje.mensaje}</p>
        </div>

        {mensaje.respuesta ? (
          <div className="message-response-box">
            <h4>Respuesta del administrador:</h4>
            <p>{mensaje.respuesta}</p>
            <small>
              📅 Respondido el:{' '}
              {formatDate(mensaje.fecha_respuesta)}
            </small>
          </div>
        ) : (
          <div className="reply-form">
            <h4>Responder al usuario:</h4>
            <textarea
              placeholder="Escribe tu respuesta..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              disabled={sending}
            />
            <button
              className="btn btn-primary"
              onClick={handleResponder}
              disabled={sending}
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {sending ? 'Enviando...' : 'Enviar respuesta'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
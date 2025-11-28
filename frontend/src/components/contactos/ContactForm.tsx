import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { contactService } from '../../services/contact.service';
import type {
  ContactMessageCreateData,
  ContactMessageResponse,
} from '../../types/ContactMessage';
import { Link } from 'react-router-dom';
import { Send, Loader2, CheckCircle, Eye } from 'lucide-react';
import '../../styles/contactos/contacto.shared.css';

const ContactForm: React.FC = () => {
  const { push } = useToast();
  const [mensaje, setMensaje] = useState('');
  const [telefono, setTelefono] = useState('');
  const [canal, setCanal] =
    useState<'EMAIL' | 'WHATSAPP' | 'TELEFONO'>('WHATSAPP');
  const [loading, setLoading] = useState(false);

  const [mensajeEnviado, setMensajeEnviado] = useState<{
    id: number;
    canal_preferido: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      push('Por favor escribe tu mensaje.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload: ContactMessageCreateData = {
        mensaje,
        telefono: telefono || null,
        canal_preferido: canal,
      };
      const response: ContactMessageResponse = await contactService.create(payload);
      setMensajeEnviado({
        id: response.data.id,
        canal_preferido: response.data.canal_preferido,
      });

      push('Mensaje enviado correctamente.', 'success');

      setMensaje('');
      setTelefono('');
    } catch (err) {
      console.error(err);
      push('Error al enviar el mensaje.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Si el mensaje ya se envió, mostramos la pantalla de éxito
  if (mensajeEnviado) {
    return (
      <div className="contact-form-container">
        <div className="contact-success-box">
          <CheckCircle size={40} color="var(--color-success)" />
          <h2 style={{ margin: '1rem 0' }}>¡Mensaje Enviado!</h2>
          <p>
            Tu mensaje ha sido recibido. Te contactaremos pronto vía{' '}
            {mensajeEnviado.canal_preferido.toLowerCase()}.
          </p>
          <Link
            to={`/contacto/${mensajeEnviado.id}`}
            className="btn btn-primary"
          >
            <Eye size={16} />
            Ver detalle de mi mensaje
          </Link>
        </div>
      </div>
    );
  }

  // Si no, mostramos el formulario
  return (
    <div className="contact-form-container">
      <h2>Contáctanos</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            placeholder="Escribe tu consulta o mensaje..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="telefono">Teléfono (Opcional)</label>
          <input
            id="telefono"
            type="text"
            placeholder="Ej: 987654321"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="canal">Canal preferido de respuesta</label>
          <select
            id="canal"
            value={canal}
            onChange={(e) =>
              setCanal(e.target.value as 'EMAIL' | 'WHATSAPP' | 'TELEFONO')
            }
          >
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">Correo electrónico</option>
            <option value="TELEFONO">Teléfono</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
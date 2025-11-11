import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contactService } from '../../services/contact.service';
import type { ContactMessage } from '../../types/ContactMessage';
import { useToast } from '../../context/ToastContext';
import { Loader2, Eye, Mail } from 'lucide-react';
import '../../styles/contactos/contacto.shared.css'; // Reutilizamos el CSS

const ContactListUser: React.FC = () => {
  const { push } = useToast();
  const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMensajes = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();

      // Obtener usuario actual desde localStorage (Mantenemos tu lógica)
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // 🔹 Filtrar solo los mensajes del usuario autenticado
      const userMessages = data.data.filter(
        (msg: ContactMessage) => msg.user_id === user.id
      );

      setMensajes(userMessages);
    } catch (err) {
      console.error(err);
      push('Error al cargar tus mensajes de contacto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando tus mensajes...
      </div>
    );

  return (
    // Usamos el contenedor de admin para consistencia visual
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">Mis Mensajes de Contacto</h2>
      </div>

      {mensajes.length === 0 ? (
        <p className="admin-list-empty">
          <Mail size={32} />
          No has enviado ningún mensaje todavía.
        </p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mensaje (extracto)</th>
                <th>Canal</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mensajes.map((m) => (
                <tr key={m.id}>
                  <td style={{ whiteSpace: 'normal', maxWidth: '300px' }}>
                    {m.mensaje.substring(0, 50)}...
                  </td>
                  <td>{m.canal_preferido}</td>
                  <td>
                    <span className={`status-badge ${m.estado.toLowerCase()}`}>
                      {m.estado}
                    </span>
                  </td>
                  <td>
                    {new Date(m.created_at ?? '').toLocaleDateString('es-PE')}
                  </td>
                  <td className="actions-cell">
                    <Link
                      to={`/contacto/${m.id}`}
                      className="btn btn-secondary"
                    >
                      <Eye size={16} />
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactListUser;
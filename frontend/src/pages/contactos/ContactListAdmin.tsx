import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/contact.service';
import type { ContactMessage } from '../../types/ContactMessage';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { Loader2, RefreshCw, Eye, Trash2, Mail } from 'lucide-react';
import '../../styles/contactos/contacto.shared.css';

const ContactListAdmin: React.FC = () => {
  const { push } = useToast();
  const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');

  const fetchMensajes = async (page = 1, estado = estadoFiltro) => {
    try {
      setLoading(true);
      const params = { page, per_page: perPage, ...(estado ? { estado } : {}) };
      const data = await contactService.getAll(params);
      setMensajes(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      push('Error al cargar mensajes de contacto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Mantenemos tu lógica de window.confirm
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este mensaje? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;

    try {
      setDeletingId(id);
      await contactService.delete(id);
      push('Mensaje eliminado correctamente.', 'success');
      setMensajes((prev) => prev.filter((m) => m.id !== id));
      if (mensajes.length === 1 && currentPage > 1) {
        // Si borramos el último de una página, retrocedemos
        fetchMensajes(currentPage - 1, estadoFiltro);
      }
    } catch (err) {
      console.error(err);
      push('No se pudo eliminar el mensaje.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) fetchMensajes(newPage);
  };

  const handleFilterChange = (estado: string) => {
    const nuevoEstado = estado === estadoFiltro ? '' : estado;
    setEstadoFiltro(nuevoEstado);
    fetchMensajes(1, nuevoEstado);
  };

  useEffect(() => {
    document.title = 'Mensajes de Contacto | Panel';
    fetchMensajes();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando mensajes...
      </div>
    );

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">📬 Mensajes de Contacto</h2>
        <div className="admin-list-actions">
          <span className="admin-list-total">
            Total: <strong>{total}</strong> mensajes
          </span>
          <button
            className="btn btn-outline"
            onClick={() => fetchMensajes(currentPage, estadoFiltro)}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Recargar
          </button>
        </div>
      </div>

      {/* 🔹 Filtros por estado */}
      <div className="contact-filter-container">
        <button
          className={`btn btn-filter ${!estadoFiltro ? 'active' : ''}`}
          onClick={() => handleFilterChange('')}
        >
          Todos
        </button>
        <button
          className={`btn btn-filter nuevo ${
            estadoFiltro === 'NUEVO' ? 'active' : ''
          }`}
          onClick={() => handleFilterChange('NUEVO')}
        >
          Nuevos
        </button>
        <button
          className={`btn btn-filter respondido ${
            estadoFiltro === 'RESPONDIDO' ? 'active' : ''
          }`}
          onClick={() => handleFilterChange('RESPONDIDO')}
        >
          Respondidos
        </button>
        <button
          className={`btn btn-filter cerrado ${
            estadoFiltro === 'CERRADO' ? 'active' : ''
          }`}
          onClick={() => handleFilterChange('CERRADO')}
        >
          Cerrados
        </button>
      </div>

      {mensajes.length === 0 ? (
        <p className="admin-list-empty">No hay mensajes disponibles.</p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Canal</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>{m.email}</td>
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
                        to={`/admin/contactos/${m.id}`}
                        className="btn btn-secondary"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        title="Eliminar"
                      >
                        {deletingId === m.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Paginación */}
          <div className="pagination-container">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn"
            >
              ◀ Anterior
            </button>
            <span className="page-info">
              Página <strong>{currentPage}</strong> de {lastPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="btn"
            >
              Siguiente ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactListAdmin;
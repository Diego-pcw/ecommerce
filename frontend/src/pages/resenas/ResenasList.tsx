import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { resenaService } from '../../services/resena.service';
import '../../styles/resenas/resena.shared.css';
import { Loader2, Eye, Check, X, Star } from 'lucide-react';

const ResenasList: React.FC = () => {
  
  const { push } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resenas, setResenas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [loading, setLoading] = useState(false);

  const esAdmin = user?.rol === 'admin';

  const fetchResenas = async (page = 1, estado = filtroEstado) => {
    try {
      setLoading(true);
      const params: any = { page };

      // 🔹 Admin ve todo, usuario solo aprobadas
      if (estado !== 'todas') {
        params.estado = estado.toUpperCase();
      } else if (!esAdmin) {
        params.estado = 'APROBADO';
      }

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

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await resenaService.update(id, { estado: nuevoEstado.toUpperCase() });
      push(`Reseña ${nuevoEstado.toLowerCase()}.`, 'success');
      fetchResenas(pagina, filtroEstado);
    } catch (err) {
      console.error(err);
      push('No se pudo actualizar el estado.', 'error');
    }
  };

  useEffect(() => {
    fetchResenas(1, filtroEstado);
  }, [filtroEstado]);

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
      <span className="star-value" style={{ fontSize: '0.8rem' }}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">Reseñas de Productos</h2>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="APROBADO">Aprobadas</option>
          <option value="RECHAZADO">Rechazadas</option>
        </select>
      </div>

      {loading ? (
        <div className="loader-container">
          <Loader2 className="animate-spin" size={32} />
          Cargando...
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Usuario</th>
                <th>Puntuación</th>
                <th>Comentario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resenas.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="admin-list-empty" style={{ padding: '2rem' }}>
                      No hay reseñas disponibles.
                    </p>
                  </td>
                </tr>
              ) : (
                resenas.map((r) => {
                  const estadoLower = r.estado.toLowerCase();
                  return (
                    <tr key={r.id}>
                      <td>{r.producto?.nombre || '—'}</td>
                      <td>{r.user?.name || 'Anónimo'}</td>
                      <td>
                        <StarRating rating={r.rating} />
                      </td>
                      <td style={{ whiteSpace: 'normal', minWidth: '200px' }}>
                        {r.comentario || 'Sin comentario'}
                      </td>
                      <td>
                        <span className={`status-badge ${estadoLower}`}>
                          {r.estado.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => navigate(`/resenas/${r.id}`)}
                            className="btn btn-secondary"
                            title="Ver detalle"
                          >
                            <Eye size={16} />
                          </button>

                          {esAdmin && (
                            <>
                              <button
                                onClick={() => actualizarEstado(r.id, 'APROBADO')}
                                disabled={r.estado === 'APROBADO'}
                                className="btn btn-success"
                                title="Aprobar"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  actualizarEstado(r.id, 'RECHAZADO')
                                }
                                disabled={r.estado === 'RECHAZADO'}
                                className="btn btn-danger"
                                title="Rechazar"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination-container">
        <button
          className="btn"
          onClick={() => fetchResenas(pagina - 1, filtroEstado)}
          disabled={pagina <= 1}
        >
          ◀ Anterior
        </button>
        <span>
          Página <strong>{pagina}</strong> de {totalPaginas}
        </span>
        <button
          className="btn"
          onClick={() => fetchResenas(pagina + 1, filtroEstado)}
          disabled={pagina >= totalPaginas}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default ResenasList;
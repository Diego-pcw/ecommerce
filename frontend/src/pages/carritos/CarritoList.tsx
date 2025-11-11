import React, { useEffect, useState } from 'react';
import carritoService from '../../services/carrito.service';
import { type Carrito, type CarritoResumen } from '../../types/Carrito';
import { useToast } from '../../context/ToastContext';
import {
  Loader2,
  ShoppingCart,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Package,
  Eye,
  Users,
} from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoList: React.FC = () => {
  const { push } = useToast();
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [resumen, setResumen] = useState<CarritoResumen | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarritos = async () => {
    try {
      const res = await carritoService.listarCarritos();
      const lista = res?.carritos?.data ?? [];
      setCarritos(lista);
      setResumen(res.resumen);
    } catch (error) {
      console.error('Error al cargar los carritos:', error);
      push('❌ Error al cargar los carritos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Carritos Activos | Panel';
    fetchCarritos();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando carritos...
      </div>
    );
  }

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">
          <ShoppingCart size={24} />
          Lista de Carritos
        </h2>
      </div>

      {/* 🔹 Mostrar resumen estadístico si existe */}
      {resumen && (
        <div className="admin-stats-bar">
          <div className="stat-item">
            <Users size={20} />
            <strong>Total:</strong> {resumen.total}
          </div>
          <div className="stat-item">
            <CheckCircle size={20} className="text-success" />
            <strong>Activos:</strong> {resumen.activos}
          </div>
          <div className="stat-item">
            <Clock size={20} className="text-warning" />
            <strong>Expirados:</strong> {resumen.expirados}
          </div>
          <div className="stat-item">
            <LinkIcon size={20} className="text-info" />
            <strong>Fusionados:</strong> {resumen.fusionados ?? 0}
          </div>
          <div className="stat-item">
            <Package size={20} className="text-secondary" />
            <strong>Vacíos:</strong> {resumen.vacios}
          </div>
        </div>
      )}

      {/* 🔹 Tabla de carritos */}
      {carritos.length === 0 ? (
        <p className="admin-list-empty">No hay carritos registrados.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario / Sesión</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Total (estimado)</th>
                <th>Última actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carritos.map((c) => {
                const total =
                  c.detalles?.reduce(
                    (acc, d) =>
                      acc + (d.cantidad ?? 0) * (d.precio_unitario ?? 0),
                    0
                  ) ?? 0;

                const usuarioLabel = c.usuario?.name
                  ? c.usuario.name
                  : c.session_id
                  ? `Sesión: ${c.session_id.slice(0, 8)}...`
                  : 'Invitado';

                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{usuarioLabel}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          c.estado ? c.estado.toLowerCase() : 'desconocido'
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td>{c.detalles?.length ?? 0}</td>
                    <td>S/ {total.toFixed(2)}</td>
                    <td>
                      {new Date(c.updated_at ?? '').toLocaleString('es-PE', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td>
                      <a
                        href={`/carritos/${c.id}`} // Mantenemos <a> de tu código
                        className="btn btn-outline"
                      >
                        <Eye size={16} />
                        Ver detalles
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CarritoList;
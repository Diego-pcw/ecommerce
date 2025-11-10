import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import type { Promocion } from '../../types/Promocion';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  Tag,
  Percent,
  CircleDollarSign,
} from 'lucide-react';
import '../../styles/promociones/promocion.shared.css';

const PromocionList: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const navigate = useNavigate();

  const fetchPromociones = async () => {
    try {
      const res = await promocionService.listar();
      setPromociones(res.data);
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      push('❌ No se pudieron cargar las promociones.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Promociones | Panel de Administración';
    fetchPromociones();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta promoción?')) return;

    try {
      await promocionService.eliminar(id);
      setPromociones((prev) => prev.filter((p) => p.id !== id));
      push('✅ Promoción eliminada correctamente.', 'success');
    } catch (error) {
      console.error('Error al eliminar promoción:', error);
      push('❌ No se pudo eliminar la promoción.', 'error');
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando promociones...
      </div>
    );

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">🎯 Gestión de Promociones</h2>
        <Link to="/promociones/crear" className="btn btn-primary">
          <Plus size={18} />
          Nueva Promoción
        </Link>
      </div>

      {promociones.length === 0 ? (
        <p className="admin-list-empty">No hay promociones registradas.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Descuento</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones.map((p) => (
                <tr key={p.id}>
                  <td>{p.titulo}</td>
                  <td>
                    {p.descuento_tipo === 'percent' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Percent size={14} /> Porcentaje
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CircleDollarSign size={14} /> Monto fijo
                      </span>
                    )}
                  </td>
                  <td>
                    {p.descuento_tipo === 'percent'
                      ? `${p.descuento_valor}%`
                      : `S/ ${Number(p.descuento_valor).toFixed(2)}`}
                  </td>
                  <td>{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                  <td>{new Date(p.fecha_fin).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${p.estado?.toLowerCase()}`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => navigate(`/promociones/${p.id}`)}
                      className="btn btn-secondary"
                      title="Ver Detalle"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/promociones/editar/${p.id}`)}
                      className="btn btn-outline"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/promociones/${p.id}/asignar/`)}
                      className="btn btn-outline"
                      title="Asignar Productos"
                      style={{ color: 'var(--color-success)' }}
                    >
                      <Tag size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-danger"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default PromocionList;

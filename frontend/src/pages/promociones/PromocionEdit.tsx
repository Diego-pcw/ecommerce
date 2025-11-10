import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import type { Promocion, PromocionUpdateData } from '../../types/Promocion';
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2 } from 'lucide-react';
import '../../styles/promociones/promocion.shared.css';

const PromocionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPromocion = async () => {
      try {
        const data = await promocionService.obtener(Number(id));
        setPromocion({
          ...data,
          descuento_valor: Number(data.descuento_valor).toFixed(2),
          fecha_inicio: data.fecha_inicio?.slice(0, 10) ?? '',
          fecha_fin: data.fecha_fin?.slice(0, 10) ?? '',
        });
        document.title = `Editar: ${data.titulo} | Panel`;
      } catch (error) {
        console.error('❌ Error al cargar promoción:', error);
        push('Error al cargar la promoción.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPromocion();
  }, [id, push]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPromocion((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'descuento_valor'
                ? value.replace(/[^0-9.]/g, '')
                : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promocion) return;
    setSaving(true);

    const valor = parseFloat(promocion.descuento_valor as unknown as string);
    if (isNaN(valor) || valor < 0.01) {
      push('El valor del descuento debe ser mayor a 0.01.', 'warning');
      setSaving(false);
      return;
    }

    try {
      const payload: PromocionUpdateData = {
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        descuento_tipo: promocion.descuento_tipo,
        descuento_valor: valor.toFixed(2),
        fecha_inicio: promocion.fecha_inicio,
        fecha_fin: promocion.fecha_fin,
        estado: promocion.estado,
      };

      await promocionService.actualizar(Number(id), payload);
      push('✅ Promoción actualizada correctamente.', 'success');
      navigate('/promociones');
    } catch (error) {
      console.error('❌ Error al actualizar promoción:', error);
      push('No se pudo actualizar la promoción.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando promoción...
      </div>
    );

  if (!promocion)
    return <p className="admin-list-empty">No se encontró la promoción.</p>;

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">✏️ Editar Promoción</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={promocion.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={promocion.descripcion ?? ''}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="descuento_tipo">Tipo de Descuento</label>
            <select
              id="descuento_tipo"
              name="descuento_tipo"
              value={promocion.descuento_tipo}
              onChange={handleChange}
            >
              <option value="percent">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (S/)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="descuento_valor">
              Valor ({promocion.descuento_tipo === 'percent' ? '%' : 'S/'})
            </label>
            <input
              id="descuento_valor"
              type="text"
              name="descuento_valor"
              value={promocion.descuento_valor ?? ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="fecha_inicio">Fecha Inicio</label>
            <input
              id="fecha_inicio"
              type="date"
              name="fecha_inicio"
              value={promocion.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="fecha_fin">Fecha Fin</label>
            <input
              id="fecha_fin"
              type="date"
              name="fecha_fin"
              value={promocion.fecha_fin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={promocion.estado}
            onChange={handleChange}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/promociones')}
            disabled={saving}
          >
            <X size={18} />
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromocionEdit;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import type { PromocionCreateData } from '../../types/Promocion';
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2 } from 'lucide-react';
import '../../styles/promociones/promocion.shared.css';

const PromocionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { push } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PromocionCreateData>({
    titulo: '',
    descripcion: '',
    descuento_tipo: 'percent',
    descuento_valor: '0.01',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'ACTIVO',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'descuento_valor' ? value.replace(/[^0-9.]/g, '') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const valor = parseFloat(formData.descuento_valor);

    if (isNaN(valor) || valor < 0.01) {
      push('El valor del descuento debe ser mayor a 0.01.', 'warning');
      setLoading(false);
      return;
    }

    try {
      await promocionService.crear({
        ...formData,
        descuento_valor: valor.toFixed(2),
      });
      push('✅ Promoción creada correctamente.', 'success');
      navigate('/promociones');
    } catch (error) {
      console.error('❌ Error al crear promoción:', error);
      push('Error al crear promoción.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">➕ Nueva Promoción</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
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
              value={formData.descuento_tipo}
              onChange={handleChange}
            >
              <option value="percent">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (S/)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="descuento_valor">
              Valor ({formData.descuento_tipo === 'percent' ? '%' : 'S/'})
            </label>
            <input
              id="descuento_valor"
              type="text"
              name="descuento_valor"
              value={formData.descuento_valor}
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
              value={formData.fecha_inicio}
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
              value={formData.fecha_fin}
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
            value={formData.estado}
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
            disabled={loading}
          >
            <X size={18} />
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromocionCreate;
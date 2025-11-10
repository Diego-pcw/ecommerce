import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoria.service';
import type { CategoriaCreateData } from '../../types/Categoria';
import '../../styles/categorias/categorias.shared.css';
// ✨ 1. Importamos iconos y el hook useToast
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2 } from 'lucide-react';

const CategoriaCreate: React.FC = () => {
  const navigate = useNavigate();
  // ✨ 2. Instanciamos el hook
  const { push } = useToast();
  const [formData, setFormData] = useState<CategoriaCreateData>({
    nombre: '',
    descripcion: '',
    estado: 'activo',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await categoriaService.crear(formData);
      // ✨ 3. Reemplazamos alert con toast de éxito
      push('Categoría creada exitosamente', 'success');
      navigate('/categorias');
    } catch (error) {
      console.error('❌ Error al crear la categoría:', error);
      // ✨ 4. Reemplazamos alert con toast de error
      push('No se pudo crear la categoría, inténtalo nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ✨ 5. Aplicamos todas las clases de CSS del shared.css
  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">Crear Nueva Categoría</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* ✨ 6. Estructura de "admin-form-group" */}
        <div className="admin-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Cascos, Llantas, Aceites..."
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            placeholder="Breve descripción de la categoría (opcional)"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* ✨ 7. Aplicamos clases a los botones */}
        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/categorias')}
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
            {loading ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaCreate;
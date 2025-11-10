import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoria.service';
import type { CategoriaUpdateData, Categoria } from '../../types/Categoria';
import '../../styles/categorias/categorias.shared.css';

// ✨ 1. Importamos iconos y el hook useToast
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2 } from 'lucide-react';

const CategoriaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // ✨ 2. Instanciamos el hook
  const { push } = useToast();

  const [formData, setFormData] = useState<CategoriaUpdateData>({
    nombre: '',
    descripcion: '',
    estado: 'activo',
  });
  const [loading, setLoading] = useState<boolean>(true); // Carga de datos
  // ✨ 3. Estado separado para el guardado (mejor UX)
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Editar Categoría | Panel';
    const fetchCategoria = async () => {
      try {
        setLoading(true);
        const data: Categoria = await categoriaService.obtenerPorId(Number(id));
        setFormData({
          nombre: data.nombre,
          // Aseguramos que descripción no sea null
          descripcion: data.descripcion || '',
          estado: data.estado,
        });
      } catch (error) {
        console.error('❌ Error al obtener la categoría:', error);
        // ✨ 4. Usamos toast para el error
        push('Error al cargar los datos de la categoría.', 'error');
        navigate('/categorias');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoria();
  }, [id, navigate, push]); // Agregamos push a las dependencias

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
    setSaving(true); // Usamos el estado 'saving'
    try {
      await categoriaService.actualizar(Number(id), formData);
      // ✨ 5. Reemplazamos alert con toast de éxito
      push('Categoría actualizada correctamente', 'success');
      navigate('/categorias');
    } catch (error) {
      console.error('❌ Error al actualizar la categoría:', error);
      // ✨ 6. Reemplazamos alert con toast de error
      push('No se pudo actualizar la categoría, inténtalo más tarde.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ✨ 7. Loader principal
  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando datos...
      </div>
    );

  // ✨ 8. Aplicamos todas las clases de CSS del shared.css
  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">Editar Categoría (ID: {id})</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        {/* ✨ 9. Estructura de "admin-form-group" */}
        <div className="admin-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
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

        {/* ✨ 10. Aplicamos clases a los botones */}
        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/categorias')}
            disabled={saving} // Deshabilitado mientras se guarda
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
            {saving ? 'Actualizando...' : 'Actualizar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaEdit;
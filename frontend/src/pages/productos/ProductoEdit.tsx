import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service.ts';
import { categoriaService } from '../../services/categoria.service.ts';
import type { ProductoUpdateData } from '../../types/Producto';
import type { Categoria } from '../../types/Categoria.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Save, X, Loader2 } from 'lucide-react';
import '../../styles/productos/productos.shared.css';

const ProductoEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductoUpdateData>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✨ Estado de guardado
  const { push } = useToast(); // ✨

  /* -------------------------------------------
   * 🔹 Cargar producto y categorías
   * ----------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);

        const [data, resCategorias] = await Promise.all([ // ✨ Promise.all
          productoService.obtenerPorId(Number(id)),
          categoriaService.obtenerTodas(),
        ]);

        const listaCategorias = Array.isArray(resCategorias)
          ? resCategorias
          : resCategorias.data ?? [];
        setCategorias(listaCategorias);
        
        document.title = `Editar: ${data.nombre} | Panel`; // ✨

        setForm({
          nombre: data.nombre,
          marca: data.marca ?? '',
          descripcion: data.descripcion ?? '',
          precio: parseFloat(data.precio_original) || data.precio_final || 0,
          stock: data.stock ?? 0,
          categoria_id:
            data.categoria_id ??
            data.categoria?.id ??
            (listaCategorias[0]?.id ?? 0),
          estado: data.estado ?? 'activo',
        });
      } catch (error) {
        console.error('Error al cargar producto o categorías:', error);
        push('❌ No se pudo cargar la información del producto.', 'error'); // ✨
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, push]); // ✨

  /* -------------------------------------------
   * 🔹 Manejar cambios (tu lógica original, simplificada)
   * ----------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'precio' || name === 'stock' || name === 'categoria_id'
          ? Number(value)
          : value,
    }));
  };

  /* -------------------------------------------
   * 🔹 Manejar envío del formulario
   * ----------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true); // ✨
      const res = await productoService.actualizar(Number(id), form);
      push(res.message || '✅ Producto actualizado correctamente', 'success'); // ✨
      setTimeout(() => navigate('/productos'), 1500);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      push('❌ Error al actualizar el producto.', 'error'); // ✨
    } finally {
      setSaving(false); // ✨
    }
  };

  /* -------------------------------------------
   * 🔹 Renderizado condicional
   * ----------------------------------------- */
  if (loading) 
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando producto...
      </div>
    );

  /* -------------------------------------------
   * 🔹 Vista principal del formulario
   * ----------------------------------------- */
  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">✏️ Editar Producto (ID: {id})</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={form.nombre ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            type="text"
            name="marca"
            value={form.marca ?? ''}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            value={form.descripcion ?? ''}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="precio">Precio (S/)</label>
            <input
              id="precio"
              type="number"
              name="precio"
              value={form.precio ?? 0}
              min="0"
              step="0.01"
              onChange={handleChange}
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              name="stock"
              value={form.stock ?? 0}
              min="0"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="categoria_id">Categoría</label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={form.categoria_id ?? ''}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {Array.isArray(categorias) &&
                categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={form.estado ?? 'activo'}
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/productos')}
            disabled={saving} // ✨
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving} // ✨
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoEdit;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import { categoriaService } from '../../services/categoria.service';
import type { ProductoCreateData } from '../../types/Producto';
import type { Categoria } from '../../types/Categoria';
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2 } from 'lucide-react';
import '../../styles/productos/productos.shared.css';

const ProductoCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductoCreateData>({
    nombre: '',
    marca: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria_id: 1, // Tu lógica original
    estado: 'activo',
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCats, setLoadingCats] = useState(true); // ✨
  const { push } = useToast(); // ✨

  /* -------------------------------------------
   * 🔹 Cargar categorías al montar el componente
   * ----------------------------------------- */
  useEffect(() => {
    document.title = "Crear Producto | Panel"; // ✨
    const fetchCategorias = async () => {
      try {
        setLoadingCats(true); // ✨
        const res = await categoriaService.obtenerTodas();
        const listaCategorias = Array.isArray(res) ? res : res.data ?? [];
        setCategorias(listaCategorias);

        if (listaCategorias.length > 0) {
          setForm((prev) => ({
            ...prev,
            categoria_id: listaCategorias[0].id,
          }));
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        push('No se pudieron cargar las categorías', 'error'); // ✨
      } finally {
        setLoadingCats(false); // ✨
      }
    };

    fetchCategorias();
  }, [push]); // ✨

  /* -------------------------------------------
   * 🔹 Manejar cambios de formulario
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
    try {
      setLoading(true);
      const res = await productoService.crear(form);
      push(res.message || '✅ Producto creado correctamente', 'success'); // ✨
      setTimeout(() => navigate('/productos'), 1200);
    } catch (error) {
      console.error(error);
      push('❌ Error al crear el producto', 'error'); // ✨
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
   * 🔹 Render
   * ----------------------------------------- */
  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">➕ Crear Producto</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="marca">Marca</label>
          <input
            id="marca"
            name="marca"
            placeholder="Marca (ej. Honda, Yamaha)"
            value={form.marca ?? ''}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción detallada del producto"
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
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              min={0}
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
              value={form.categoria_id}
              onChange={handleChange}
              required
              disabled={loadingCats} // ✨
            >
              <option value="">{loadingCats ? "Cargando..." : "Selecciona una categoría"}</option>
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
            <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
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
            disabled={loading}
          >
            <X size={18} />
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoCreate;
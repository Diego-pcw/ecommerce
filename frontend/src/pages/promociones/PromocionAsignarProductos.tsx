import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import { productoService } from '../../services/producto.service';
import type { Producto } from '../../types/Producto';
import { useToast } from '../../context/ToastContext';
import { Loader2, Save, X, Search } from 'lucide-react';
import '../../styles/promociones/promocion.shared.css';

const PromocionAsignarProductos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosProductos, promo] = await Promise.all([
          productoService.obtenerTodos({ estado: 'activo' }),
          promocionService.obtener(Number(id)),
        ]);

        setProductos(todosProductos.data || todosProductos);
        const idsAsignados = promo.productos?.map((p: Producto) => p.id) || [];
        setSelected(idsAsignados);
        document.title = `Asignar Productos a: ${promo.titulo}`;
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        push('No se pudieron cargar los productos o la promoción.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, push]);

  const filteredProductos = useMemo(
    () =>
      productos.filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      ),
    [productos, search]
  );

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await promocionService.asignarProductos(Number(id), {
        productos: selected,
      });
      push('✅ Productos asignados correctamente.', 'success');
      navigate(`/promociones/${id}`);
    } catch (error) {
      console.error('❌ Error al asignar productos:', error);
      push('Ocurrió un error al asignar los productos.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando datos...
      </div>
    );

  return (
    <div className="admin-list-container">
      <h2 className="admin-list-title">Asignar Productos a la Promoción</h2>

      <div className="admin-list-filters" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-disabled)',
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No se encontraron productos activos.
                  </td>
                </tr>
              ) : (
                filteredProductos.map((producto) => (
                  <tr
                    key={producto.id}
                    className={
                      selected.includes(producto.id) ? 'selected' : ''
                    }
                    onClick={() => toggleSelection(producto.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(producto.id)}
                        onChange={() => {}} // El onClick del TR ya lo maneja
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>
                      S/{' '}
                      {Number(
                        producto.precio_final ??
                          producto.precio_original ??
                          producto.precio ??
                          0
                      ).toFixed(2)}
                    </td>
                    <td>{producto.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${producto.estado
                          ?.toLowerCase()
                          .trim()}`}
                      >
                        {producto.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/promociones')}
            disabled={saving}
          >
            <X size={18} />
            Volver
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
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

export default PromocionAsignarProductos;
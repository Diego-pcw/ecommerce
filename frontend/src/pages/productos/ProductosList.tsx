import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import type { ProductoListItem } from '../../types/Producto';
import styles from '../../styles/carritos/Carrito.module.css'; // ✅ reutilizamos los estilos de precio
import { useToast } from '../../context/ToastContext';
import { Plus, Eye, Edit2, Trash2, Loader2, Tag } from 'lucide-react';
import '../../styles/productos/productos.shared.css';

const ProductosList: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Mantenemos tu lógica
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { push } = useToast(); // ✨ Toast

  useEffect(() => {
    document.title = 'Productos | Panel de Administración'; // ✨
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await productoService.obtenerTodos();
        setProductos(res.data ?? []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        const errorMsg = 'No se pudieron cargar los productos ❌';
        setError(errorMsg);
        push(errorMsg, 'error'); // ✨ Toast
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [push]); // ✨

  const handleCreate = () => navigate('/productos/crear');
  const handleEdit = (id: number) => navigate(`/productos/editar/${id}`);
  const handleDetail = (id: number) => navigate(`/productos/${id}`);

  const handleDelete = async (id: number) => {
    const ok = confirm( // Mantenemos el confirm original
      '¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.'
    );
    if (!ok) return;
    try {
      setDeletingId(id);
      await productoService.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      push('Producto eliminado correctamente.', 'success'); // ✨ Toast
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      push('No se pudo eliminar el producto ❌', 'error'); // ✨ Toast
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando productos...
      </div>
    );
  if (error) return <p className="admin-list-empty">{error}</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">📦 Lista de Productos</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="admin-list-empty">No hay productos registrados.</p>
      ) : (
        <ul className="admin-list">
          {productos.map((prod) => {
            const tieneDescuento =
              prod.promocion_vigente &&
              Number(prod.promocion_vigente.valor || 0) > 0;

            return (
              <li key={prod.id} className="admin-card-item">
                {/* ✨ AQUI ESTÁ EL CAMBIO:
                  Replicamos el contenido de ProductoCard aquí
                  para no incluir el botón "Agregar al Carrito".
                */}
                <div className="admin-card-info">
                  <div className="product-card-content">
                    {prod.imagenes?.[0] ? (
                      <img
                        src={prod.imagenes[0].url}
                        alt={prod.nombre}
                        className="product-card-image"
                      />
                    ) : (
                      <div className="product-card-image product-card-placeholder">
                        <span>Sin imagen</span>
                      </div>
                    )}
                    <h2>{prod.nombre}</h2>
                    <p>{prod.categoria as string}</p>
                  </div>
                </div>

                {tieneDescuento && (
                  <div style={{ padding: '0 1.5rem' }}>
                    <span className="product-discount-badge" style={{position: 'static', display: 'inline-flex', top: 0, right: 0}}>
                      <Tag size={12} /> {prod.promocion_vigente?.valor}% de descuento
                    </span>
                  </div>
                )}

                {/* Precios (tu lógica original) */}
                <div className="product-price-container">
                  {tieneDescuento ? (
                    <>
                      <p className={styles.priceOriginal}>
                        S/ {Number(prod.precio_original).toFixed(2)}
                      </p>
                      <p className={styles.priceFinalWithDiscount}>
                        S/ {Number(prod.precio_final).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className={styles.priceFinal}>
                      S/ {Number(prod.precio_final ?? prod.precio_original).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Botones de Admin */}
                <div className="admin-card-actions">
                  <button
                    onClick={() => handleDetail(prod.id)}
                    className="btn btn-secondary"
                  >
                    <Eye size={16} /> Ver
                  </button>
                  <button
                    onClick={() => handleEdit(prod.id)}
                    className="btn btn-outline"
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="btn btn-danger"
                    disabled={deletingId === prod.id}
                  >
                    {deletingId === prod.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    {deletingId === prod.id ? '...' : 'Eliminar'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProductosList;
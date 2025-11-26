import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import type { ProductoListItem } from '../../types/Producto';
import styles from '../../styles/carritos/Carrito.module.css';
import { useToast } from '../../context/ToastContext';
import { Plus, Eye, Edit2, Trash2, Loader2, Tag } from 'lucide-react';
import '../../styles/productos/productos.shared.css';

const ProductosList: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 🔥 PAGINACIÓN
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // ➕ Para el input "Ir a página"
  const [goToPageInput, setGoToPageInput] = useState('');

  const navigate = useNavigate();
  const { push } = useToast();

  // -------------------------------------------
  // 📌 Cargar productos
  // -------------------------------------------
  const fetchProductos = async (page = 1, perPage = pagination.per_page) => {
    try {
      setLoading(true);

      const res = await productoService.obtenerTodos({ page, per_page: perPage });

      setProductos(res.data ?? []);

      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: perPage,
        total: res.total, // 🟦 contador oficial
      });

    } catch (err) {
      console.error('Error al cargar productos:', err);
      const errorMsg = 'No se pudieron cargar los productos ❌';
      setError(errorMsg);
      push(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Productos | Panel de Administración';
    fetchProductos(1, pagination.per_page);
  }, []);

  const handleCreate = () => navigate('/productos/crear');
  const handleEdit = (id: number) => navigate(`/productos/editar/${id}`);
  const handleDetail = (id: number) => navigate(`/productos/${id}`);

  const handleDelete = async (id: number) => {
    const ok = confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.');
    if (!ok) return;

    try {
      setDeletingId(id);
      await productoService.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      push('Producto eliminado correctamente.', 'success');

      // volver a cargar página actual
      fetchProductos(pagination.current_page, pagination.per_page);

    } catch (err) {
      console.error('Error al eliminar producto:', err);
      push('No se pudo eliminar el producto ❌', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // -------------------------------------------
  // 🔄 Cambiar página
  // -------------------------------------------
  const changePage = (page: number) => {
    if (page < 1 || page > pagination.last_page) return;
    fetchProductos(page, pagination.per_page);
  };

  // -------------------------------------------
  // 🟦 Cambiar cantidad por página
  // -------------------------------------------
  const changePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);

    setPagination((prev) => ({
      ...prev,
      per_page: perPage,
    }));

    fetchProductos(1, perPage);
  };

  // -------------------------------------------
  // 🟩 Ir a página específica
  // -------------------------------------------
  const goToPage = () => {
    const page = Number(goToPageInput);

    if (!page || page < 1 || page > pagination.last_page) {
      push('Número de página inválido', 'error');
      return;
    }

    changePage(page);
  };

  // -------------------------------------------
  // 🧮 Paginación avanzada (estilo profesional)
  // -------------------------------------------
  const renderPageNumbers = () => {
    const { current_page, last_page } = pagination;
    const pages = [];

    const addPage = (page: number) => {
      pages.push(
        <button
          key={page}
          onClick={() => changePage(page)}
          className={`pagination-btn ${page === current_page ? 'active' : ''}`}
        >
          {page}
        </button>
      );
    };

    addPage(1);

    if (current_page > 4) {
      pages.push(<span key="start-ellipsis" className="pagination-ellipsis">…</span>);
    }

    const start = Math.max(2, current_page - 2);
    const end = Math.min(last_page - 1, current_page + 2);

    for (let i = start; i <= end; i++) addPage(i);

    if (current_page < last_page - 3) {
      pages.push(<span key="end-ellipsis" className="pagination-ellipsis">…</span>);
    }

    if (last_page > 1) addPage(last_page);

    return pages;
  };

  // -------------------------------------------
  // UI
  // -------------------------------------------
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

      {/* 🟦 CONTADOR */}
      <p className="admin-list-counter">
        Total de productos: <strong>{pagination.total}</strong>
      </p>

      {/* 🟦 Selector de cantidad por página */}
      <div className="pagination-extra-controls">
        <label>
          Mostrar:{' '}
          <select value={pagination.per_page} onChange={changePerPage}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>{' '}
          por página
        </label>
      </div>

      {productos.length === 0 ? (
        <p className="admin-list-empty">No hay productos registrados.</p>
      ) : (
        <>
          <ul className="admin-list">
            {productos.map((prod) => {
              const tieneDescuento =
                prod.promocion_vigente &&
                Number(prod.promocion_vigente.valor || 0) > 0;

              return (
                <li key={prod.id} className="admin-card-item">
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
                      <span
                        className="product-discount-badge"
                        style={{ position: 'static', display: 'inline-flex' }}
                      >
                        <Tag size={12} /> {prod.promocion_vigente?.valor}% de descuento
                      </span>
                    </div>
                  )}

                  {/* Precios */}
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

                  {/* Botones Admin */}
                  <div className="admin-card-actions">
                    <button onClick={() => handleDetail(prod.id)} className="btn btn-secondary">
                      <Eye size={16} /> Ver
                    </button>

                    <button onClick={() => handleEdit(prod.id)} className="btn btn-outline">
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

          {/* PAGINACIÓN */}
          <div className="pagination-container">
            <button
              onClick={() => changePage(pagination.current_page - 1)}
              className="pagination-btn"
              disabled={pagination.current_page === 1}
            >
              « Anterior
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => changePage(pagination.current_page + 1)}
              className="pagination-btn"
              disabled={pagination.current_page === pagination.last_page}
            >
              Siguiente »
            </button>
          </div>

          {/* 🟩 IR A PÁGINA */}
          <div className="pagination-go-container">
            <input
              type="number"
              min={1}
              max={pagination.last_page}
              value={goToPageInput}
              onChange={(e) => setGoToPageInput(e.target.value)}
              placeholder="N° de página"
            />
            <button onClick={goToPage} className="btn btn-primary">Ir</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductosList;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { productoService } from '../../services/producto.service.ts';
import { categoriaService } from '../../services/categoria.service.ts';
import type { ProductoListItem } from '../../types/Producto.ts';
import type { Categoria } from '../../types/Categoria.ts';
import ProductoCard from '../../components/productos/ProductoCard.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Search,
  Filter,
  ArrowDownUp,
  RotateCcw,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import '../../styles/productos/catalogo.shared.css';
import '../../styles/productos/productos.shared.css';

const CatalogoProduct: React.FC = () => {

  const { push } = useToast();
  const location = useLocation();

  // 🔹 Estados de Datos
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // 🔹 Estado de carga inteligente
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // 🔹 Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState<string>('recent');

  // 🔹 Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const perPage = 12;

  // 🔹 Refs para evitar 429
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1️⃣ Cargar Categorías al inicio
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await categoriaService.obtenerTodas();
        setCategorias(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        console.error('Error cargando categorías', err);
      }
    };
    loadCats();
  }, []);

  // 🆕 2️⃣ Leer `categoria_id` desde la URL y aplicarlo al filtro solo una vez
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaId = params.get('categoria_id');

    if (categoriaId) {
      setSelectedCategory(Number(categoriaId));
      setPage(1);
    }
  }, [location.search]);

  // 2️⃣ Función principal de búsqueda optimizada con useCallback
  const fetchCatalog = useCallback(async () => {
    // Cancelar petición anterior si existe (Evita race conditions y 429)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newController = new AbortController();
    abortControllerRef.current = newController;

    setIsFetching(true);

    try {
      // Mapeo de ordenamiento
      let sort_by = 'id';
      let sort_dir = 'desc';

      switch (sortBy) {
        case 'price_asc': sort_by = 'precio'; sort_dir = 'asc'; break;
        case 'price_desc': sort_by = 'precio'; sort_dir = 'desc'; break;
        case 'name_asc': sort_by = 'nombre'; sort_dir = 'asc'; break;
        case 'name_desc': sort_by = 'nombre'; sort_dir = 'desc'; break;
        case 'recent': default: sort_by = 'id'; sort_dir = 'desc'; break;
      }

      const params = {
        page,
        per_page: perPage,
        search: searchTerm,
        categoria_id: selectedCategory ? Number(selectedCategory) : undefined,
        precio_min: priceMin ? Number(priceMin) : undefined,
        precio_max: priceMax ? Number(priceMax) : undefined,
        sort_by,
        sort_dir,
        estado: 'activo',
        // Nota: Aquí idealmente pasarías { signal: newController.signal } a axios
        // para cancelar realmente la petición de red.
      };

      
      const res = await productoService.obtenerTodos(params);

      // Si el componente se desmontó o se canceló (por el ref), no actualizamos estado
      if (newController.signal.aborted) return;

      setProductos(res.data ?? []);
      setPage(res.current_page);
      setTotalPages(res.last_page);
      setTotalProducts(res.total);
      setIsFirstLoad(false);

    } catch (error: any) {
      // Ignoramos errores de cancelación si axios los lanza
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
      
      console.error(error);
      // Solo mostramos toast si no es una cancelación intencional
      if (!newController.signal.aborted) {
         // Opcional: puedes silenciar el error 429 en el toast para no molestar al usuario
         if (error.response?.status !== 429) {
            push('Error al cargar el catálogo.', 'error');
         }
      }
    } finally {
      if (!newController.signal.aborted) {
        setIsFetching(false);
      }
    }
  }, [page, perPage, searchTerm, selectedCategory, priceMin, priceMax, sortBy, push]);

  // 3️⃣ Efecto de carga
  // Se ejecuta cuando cambian las dependencias de fetchCatalog (filtros o página)
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);
  
  // Scroll arriba solo cuando cambia la página explícitamente, no al filtrar
  useEffect(() => {
    if (!isFirstLoad) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  // 4️⃣ Manejadores
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Esto disparará el efecto de fetchCatalog
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('recent');
    setPage(1);
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">
          Catálogo de <span>Productos</span>
        </h1>
        <p className="catalog-subtitle">
          Explora nuestra selección de accesorios y repuestos de alta calidad.
        </p>
      </div>

      {/* 🛠️ BARRA DE FILTROS */}
      <div className="filters-wrapper">
        <form onSubmit={handleSearchSubmit} className="filters-grid">
          {/* 1. Buscador */}
          <div className="filter-group">
            <label className="filter-label">
              <Search size={14} /> Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 2. Categoría */}
          <div className="filter-group">
            <label className="filter-label">
              <Filter size={14} /> Categoría
            </label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value ? Number(e.target.value) : '');
                setPage(1);
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Rango de Precio */}
          <div className="filter-group">
            <label className="filter-label">Precio (S/)</label>
            <div className="price-range-group">
              <input
                type="number"
                placeholder="Min"
                className="filter-input"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                min={0}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="filter-input"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                min={0}
              />
            </div>
          </div>

          {/* 4. Ordenar */}
          <div className="filter-group">
            <label className="filter-label">
              <ArrowDownUp size={14} /> Ordenar por
            </label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1); // Resetear página al reordenar
              }}
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="name_asc">Nombre: A - Z</option>
              <option value="name_desc">Nombre: Z - A</option>
            </select>
          </div>

          {/* 5. Botones Acción */}
          <div className="filter-group" style={{ flexDirection: 'row', gap: '0.5rem' }}>
             <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
               Filtrar
             </button>
             <button
               type="button"
               onClick={handleClearFilters}
               className="btn-clear-filters"
               title="Limpiar filtros"
             >
               <RotateCcw size={16} />
             </button>
          </div>
        </form>
      </div>

      {/* 📊 RESULTADOS */}
      <div className="catalog-results-count" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isFetching && <Loader2 className="animate-spin" size={16} color="var(--color-primary)" />}
        <span>
          Mostrando <strong>{productos.length}</strong> de{' '}
          <strong>{totalProducts}</strong> productos encontrados.
        </span>
      </div>

      {/* LOGICA DE CARGA: Evita parpadeo de "No hay productos" */}
      {isFirstLoad ? (
        <div className="loader-container">
          <Loader2 className="animate-spin" size={48} />
          <p>Cargando catálogo...</p>
        </div>
      ) : (
        <div style={{ position: 'relative', minHeight: '300px' }}>
          
          {/* Overlay de carga sutil para siguientes búsquedas (Mejora visual) */}
          {isFetching && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.5)',
              zIndex: 10,
              borderRadius: 'var(--border-radius-lg)',
              pointerEvents: 'none' // Permite ver pero no clicar
            }} />
          )}

          {productos.length === 0 && !isFetching ? (
            <div className="catalog-empty">
              <ShoppingBag size={48} style={{ margin: '0 auto 1rem', color: '#ccc' }} />
              <h3>No encontramos productos</h3>
              <p>Intenta ajustar tus filtros de búsqueda.</p>
              <button
                onClick={handleClearFilters}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <div className="catalog-grid" style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {productos.map((prod) => (
                  
                  <ProductoCard key={prod.id} producto={prod} />
                ))}
              </div>

              {/* 📄 PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <div className="pagination-container">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="pagination-btn"
                      disabled={page === 1 || isFetching}
                    >
                      « Anterior
                    </button>

                    <span style={{ margin: '0 1rem', fontWeight: 600 }}>
                      Página {page} de {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="pagination-btn"
                      disabled={page === totalPages || isFetching}
                    >
                      Siguiente »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogoProduct;
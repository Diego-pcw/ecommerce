import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoria.service';
import type { Categoria } from '../../types/Categoria';
// ✨ 1. Importamos iconos y el hook useToast
import { Plus, Eye, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import '../../styles/categorias/categorias.shared.css';

const CategoriaList: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const navigate = useNavigate();
  // ✨ 2. Instanciamos el hook
  const { push } = useToast();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      // Asumimos que el servicio puede manejar 'todos' o pasamos undefined
      const estado = filtroEstado === 'todos' ? undefined : filtroEstado;
      const res = await categoriaService.obtenerTodas(page, estado);
      setCategorias(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
      // ✨ 3. Usamos el toast para errores
      push('Error al cargar categorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Categorías | Panel de Administración';
    fetchCategorias();
  }, [page, filtroEstado]);

  // 🧩 Función para eliminar categoría
  const handleEliminar = async (id: number) => {
    // Mantenemos tu lógica de window.confirm
    const confirmar = window.confirm(
      '⚠️ ¿Estás seguro de que deseas eliminar esta categoría?'
    );
    if (!confirmar) return;

    try {
      await categoriaService.eliminar(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
      // ✨ 4. Reemplazamos alert con toast de éxito
      push('Categoría eliminada correctamente.', 'success');
    } catch (error) {
      console.error('❌ Error al eliminar categoría:', error);
      // ✨ 5. Reemplazamos alert con toast de error
      push('Ocurrió un error al eliminar la categoría.', 'error');
    }
  };

  // 🔍 Filtrado dinámico adicional (solo texto)
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) =>
      cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  // ✨ 6. Usamos el loader-container
  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando categorías...
      </div>
    );

  // ✨ 7. Aplicamos todas las clases de CSS del shared.css
  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">Gestión de Categorías</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/categorias/crear')}
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      {/* 🔎 Buscador y Filtros */}
      <div className="admin-list-filters">
        <input
          type="search" // Usamos search para mejor semántica
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            // setPage(1); // El filtro es local, no necesita resetear página
          }}
        />

        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setPage(1);
          }}
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {categoriasFiltradas.length === 0 ? (
        <p className="admin-list-empty">
          No se encontraron categorías que coincidan.
        </p> // ✨ ¡Error corregido! Era </f>
      ) : (
        <ul className="admin-list">
          {categoriasFiltradas.map((cat) => (
            <li key={cat.id} className="admin-card-item">
              <div className="admin-card-info">
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion || 'Sin descripción disponible.'}</p>
                <span className={`status-badge ${cat.estado}`}>
                  {cat.estado}
                </span>
              </div>

              <div className="admin-card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/categorias/${cat.id}`)}
                >
                  <Eye size={16} />
                  Ver
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/categorias/editar/${cat.id}`)}
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleEliminar(cat.id)}
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔸 Paginación */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página <strong>{page}</strong> de {totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriaList;
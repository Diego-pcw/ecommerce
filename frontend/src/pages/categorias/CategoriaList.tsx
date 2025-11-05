import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { categoriaService } from "../../services/categoria.service";
import type { Categoria } from "../../types/Categoria";
import "../../styles/categorias/categorias.shared.css";

const CategoriaList: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await categoriaService.obtenerTodas(page, filtroEstado);
      setCategorias(res.data || []);
      setTotalPages(res.last_page || 1);
    } catch (error) {
      console.error("❌ Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Categorías | Panel de Administración";
    fetchCategorias();
  }, [page, filtroEstado]); // ✅ ahora recarga al cambiar el filtro también

  // 🧩 Función para eliminar categoría
  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "⚠️ ¿Estás seguro de que deseas eliminar esta categoría?"
    );
    if (!confirmar) return;

    try {
      await categoriaService.eliminar(id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
      alert("✅ Categoría eliminada correctamente.");
    } catch (error) {
      console.error("❌ Error al eliminar categoría:", error);
      alert("Ocurrió un error al eliminar la categoría.");
    }
  };

  // 🔍 Filtrado dinámico adicional (solo texto)
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) =>
      cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categorias, searchTerm]);

  if (loading)
    return <div className="categoria-loader">Cargando categorías...</div>;

  return (
    <div className="categoria-list-container">
      <div className="categoria-header">
        <h2 className="categoria-title">Gestión de Categorías</h2>
        <button
          className="btn-crear"
          onClick={() => navigate("/categorias/crear")}
        >
          + Nueva Categoría
        </button>
      </div>

      {/* 🔎 Buscador y Filtros */}
      <div className="categoria-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setPage(1);
          }}
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      {categoriasFiltradas.length === 0 ? (
        <p className="categoria-empty">No se encontraron categorías.</p>
      ) : (
        <ul className="categoria-list">
          {categoriasFiltradas.map((cat) => (
            <li key={cat.id} className="categoria-item">
              <div className="categoria-info">
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion || "Sin descripción disponible."}</p>
                <span className={`estado ${cat.estado}`}>
                  {cat.estado === "activo" ? "🟢 Activo" : "🔴 Inactivo"}
                </span>
              </div>

              <div className="categoria-actions">
                <button
                  className="btn-detalle"
                  onClick={() => navigate(`/categorias/${cat.id}`)}
                >
                  👁️ Ver Detalle
                </button>
                <button
                  className="btn-editar"
                  onClick={() => navigate(`/categorias/editar/${cat.id}`)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(cat.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔸 Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Anterior
          </button>
          <span>
            Página <strong>{page}</strong> de {totalPages}
          </span>
          <button
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

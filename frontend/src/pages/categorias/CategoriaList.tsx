// src/pages/categorias/CategoriaList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriaService } from "../../services/categoria.service";
import type { Categoria } from "../../types/Categoria";
import "../../styles/categorias.shared.css";

const CategoriaList: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Categorías | Panel de Administración";
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const res = await categoriaService.obtenerTodas(page);
        setCategorias(res.data || []);
        setTotalPages(res.last_page || 1);
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [page]);

  if (loading) return <div className="categoria-loader">Cargando categorías...</div>;

  return (
    <div className="categoria-list-container">
      <div className="categoria-header">
        <h2 className="categoria-title">Listado de Categorías</h2>
        <button
          className="btn-crear"
          onClick={() => navigate("/categorias/crear")}
          aria-label="Crear nueva categoría"
        >
          + Nueva Categoría
        </button>
      </div>

      {categorias.length === 0 ? (
        <p className="categoria-empty">No hay categorías registradas.</p>
      ) : (
        <ul className="categoria-list">
          {categorias.map((cat) => (
            <li key={cat.id} className="categoria-item">
              <div className="categoria-info">
                <h3>{cat.nombre}</h3>
                <p>{cat.descripcion || "Sin descripción."}</p>
                <span className={`estado ${cat.estado}`}>{cat.estado}</span>
              </div>
              <div className="categoria-actions">
                <button
                  className="btn-editar"
                  onClick={() => navigate(`/categorias/editar/${cat.id}`)}
                  aria-label={`Editar categoría ${cat.nombre}`}
                >
                  ✏️ Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
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

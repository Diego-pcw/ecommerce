import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoriaService } from "../../services/categoria.service";
import type { Categoria } from "../../types/Categoria";
import { useToast } from "../../context/ToastContext";
import styles from "../../styles/categorias/CategoriaDetail.module.css";

const CategoriaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoria = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await categoriaService.obtenerPorId(Number(id));
      setCategoria(data);
    } catch (error) {
      console.error(error);
      push("Error al cargar la categoría.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoria();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando detalle...</p>;
  if (!categoria) return <p className={styles.empty}>No se encontró la categoría.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Detalle de Categoría</h2>
        <div className={styles.actions}>
          <button
            className={styles.btnBack}
            onClick={() => navigate("/categorias")}
          >
            ← Volver
          </button>
          <button
            className={styles.btnEdit}
            onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
          >
            ✏️ Editar
          </button>
        </div>
      </div>

      <div className={styles.detailBox}>
        <p>
          <strong>ID:</strong> {categoria.id}
        </p>
        <p>
          <strong>Nombre:</strong> {categoria.nombre}
        </p>
        <p>
          <strong>Descripción:</strong>{" "}
          {categoria.descripcion || "Sin descripción."}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={`${styles.estado} ${
              categoria.estado === "activo" ? styles.activo : styles.inactivo
            }`}
          >
            {categoria.estado === "activo" ? "🟢 Activo" : "🔴 Inactivo"}
          </span>
        </p>
        <p>
          <strong>Fecha de creación:</strong>{" "}
          {categoria.created_at
            ? new Date(categoria.created_at).toLocaleString("es-PE")
            : "—"}
        </p>
        <p>
          <strong>Última actualización:</strong>{" "}
          {categoria.updated_at
            ? new Date(categoria.updated_at).toLocaleString("es-PE")
            : "—"}
        </p>
      </div>
    </div>
  );
};

export default CategoriaDetail;

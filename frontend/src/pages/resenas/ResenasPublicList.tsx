import React, { useEffect, useState } from "react";
import styles from "../../styles/resenas/ResenasPublicList.module.css";
import { resenaService } from "../../services/resena.service";
import { useToast } from "../../context/ToastContext";

const ResenasPublicList: React.FC = () => {
  const { push } = useToast();
  const [resenas, setResenas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResenas = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        estado: "APROBADO",
      };

      const data = await resenaService.getAll(params);
      setResenas(data.data ?? []);
      setPagina(data.current_page ?? 1);
      setTotalPaginas(data.last_page ?? 1);
    } catch (err) {
      console.error(err);
      push("Error al cargar reseñas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas(1);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Opiniones de Nuestros Clientes</h2>
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p className={styles.empty}>No hay reseñas disponibles.</p>
      ) : (
        <div className={styles.list}>
          {resenas.map((r) => (
            <div key={r.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{r.producto?.nombre ?? "Producto desconocido"}</h3>
                <div className={styles.rating}>
                  {"★".repeat(Math.round(r.rating)) +
                    "☆".repeat(5 - Math.round(r.rating))}
                  <span className={styles.ratingValue}>
                    {r.rating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <p className={styles.comentario}>"{r.comentario}"</p>
              <p className={styles.user}>
                — {r.user?.name ?? "Usuario anónimo"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => fetchResenas(pagina - 1)}
          disabled={pagina <= 1}
        >
          ◀ Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => fetchResenas(pagina + 1)}
          disabled={pagina >= totalPaginas}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default ResenasPublicList;

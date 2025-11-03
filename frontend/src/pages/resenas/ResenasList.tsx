import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/resenas/ResenasList.module.css";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { resenaService } from "../../services/resena.service";

const ResenasList: React.FC = () => {
  const { push } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resenas, setResenas] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [loading, setLoading] = useState(false);

  const esAdmin = user?.rol === "admin";

  const fetchResenas = async (page = 1, estado = filtroEstado) => {
    try {
      setLoading(true);
      const params: any = { page };

      // 🔹 Admin ve todo, usuario solo aprobadas
      if (estado !== "todas") {
        params.estado = estado.toUpperCase();
      } else if (!esAdmin) {
        params.estado = "APROBADO";
      }

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

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await resenaService.update(id, { estado: nuevoEstado.toUpperCase() });
      push(`Reseña ${nuevoEstado.toLowerCase()}.`, "success");
      fetchResenas(pagina, filtroEstado);
    } catch (err) {
      console.error(err);
      push("No se pudo actualizar el estado.", "error");
    }
  };

  useEffect(() => {
    fetchResenas(1, filtroEstado);
  }, [filtroEstado]);

  return (
    <div className={styles.resenasContainer}>
      <div className={styles.header}>
        <h2>Reseñas de Productos</h2>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="todas">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="APROBADO">Aprobadas</option>
          <option value="RECHAZADO">Rechazadas</option>
        </select>
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Usuario</th>
              <th>Puntuación</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resenas.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No hay reseñas disponibles.
                </td>
              </tr>
            ) : (
              resenas.map((r) => {
                const estadoLower = r.estado.toLowerCase();
                return (
                  <tr key={r.id}>
                    <td>{r.producto?.nombre || "—"}</td>
                    <td>{r.user?.name || "Anónimo"}</td>
                    <td>
                      {"★".repeat(Math.round(r.rating)) +
                        "☆".repeat(5 - Math.round(r.rating))}
                      <span className={styles.ratingValue}>
                        {r.rating.toFixed(1)}/5
                      </span>
                    </td>
                    <td>{r.comentario || "Sin comentario"}</td>
                    <td className={styles[`estado_${estadoLower}`]}>
                      {r.estado.toUpperCase()}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => navigate(`/resenas/${r.id}`)}
                          className={styles.btnDetalle}
                        >
                          🔍 Ver
                        </button>

                        {esAdmin && (
                          <>
                            <button
                              onClick={() =>
                                actualizarEstado(r.id, "APROBADO")
                              }
                              disabled={r.estado === "APROBADO"}
                              className={styles.btnAprobar}
                            >
                              ✅
                            </button>
                            <button
                              onClick={() =>
                                actualizarEstado(r.id, "RECHAZADO")
                              }
                              disabled={r.estado === "RECHAZADO"}
                              className={styles.btnRechazar}
                            >
                              ❌
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => fetchResenas(pagina - 1, filtroEstado)}
          disabled={pagina <= 1}
        >
          ◀ Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => fetchResenas(pagina + 1, filtroEstado)}
          disabled={pagina >= totalPaginas}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default ResenasList;

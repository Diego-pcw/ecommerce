import React, { useEffect, useState } from "react";
import styles from "../../styles/resenas/ResenaDetalle.module.css";
import { useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { resenaService, type Resena } from "../../services/resena.service";

const ResenaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [resena, setResena] = useState<Resena | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetalle = async () => {
    if (!id) {
      push("ID de reseña inválido.", "error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await resenaService.getById(Number(id));
      setResena(data?.data || data); // Por compatibilidad con distintos formatos de respuesta
    } catch (err) {
      console.error("❌ Error al obtener detalle de reseña:", err);
      push("No se pudo cargar la reseña.", "error");
      setResena(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando reseña...</p>;
  if (!resena) return <p className={styles.empty}>Reseña no encontrada.</p>;

  const formatDate = (fecha?: string) =>
    fecha
      ? new Date(fecha).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <div className={styles.detalleContainer}>
      <h2>Detalle de Reseña</h2>

      <div className={styles.card}>
        <div className={styles.header}>
          <h3>{resena.producto?.nombre || "Producto desconocido"}</h3>
          <span className={styles[`estado_${resena.estado.toLowerCase()}`]}>
            {resena.estado.toUpperCase()}
          </span>
        </div>

        {resena.titulo && (
          <p className={styles.titulo}>
            <strong>Título:</strong> {resena.titulo}
          </p>
        )}

        <div className={styles.info}>
          <p>
            <strong>Usuario:</strong> {resena.user?.name || "Desconocido"}
          </p>
          <p>
            <strong>Puntuación:</strong>{" "}
            <span className={styles.puntuacion}>
              {"★".repeat(Math.round(resena.rating))}
              {"☆".repeat(5 - Math.round(resena.rating))}
              <small> ({resena.rating}/5)</small>
            </span>
          </p>
          <p>
            <strong>Creado el:</strong> {formatDate(resena.created_at)}
          </p>
          <p>
            <strong>Última actualización:</strong> {formatDate(resena.updated_at)}
          </p>
        </div>

        <div className={styles.comentario}>
          <h4>Comentario:</h4>
          <p>{resena.comentario || "Sin comentario disponible."}</p>
        </div>
      </div>
    </div>
  );
};

export default ResenaDetalle;

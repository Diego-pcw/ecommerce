import React, { useState } from "react";
import styles from "../../styles/resenas/ResenaForm.module.css";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { resenaService } from "../../services/resena.service";

interface ResenaFormProps {
  productoId: number;
  onSuccess?: () => void;
}

const ResenaForm: React.FC<ResenaFormProps> = ({ productoId, onSuccess }) => {
  const { user } = useAuth();
  const { push } = useToast();
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      push("Debes iniciar sesión para dejar una reseña.", "warning");
      return;
    }

    if (!productoId) {
      push("Error: producto no identificado.", "error");
      return;
    }

    if (!comentario.trim()) {
      push("Por favor, escribe un comentario.", "warning");
      return;
    }

    try {
      setLoading(true);
      await resenaService.create({
        producto_id: productoId,
        rating: puntuacion,
        comentario: comentario.trim(),
      });

      push("✅ Reseña enviada. Espera aprobación del administrador.", "success");
      setComentario("");
      setPuntuacion(5);
      onSuccess?.();
    } catch (err: any) {
      console.error("❌ Error al enviar reseña:", err);
      const mensaje =
        err.response?.data?.message ||
        "No se pudo enviar la reseña debido a un error de validación o conexión.";
      push(mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3>Escribe una reseña</h3>

      <div className={styles.rating}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`${styles.star} ${puntuacion >= n ? styles.active : ""}`}
            onClick={() => setPuntuacion(n)}
            role="button"
            aria-label={`Puntuación ${n}`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Comparte tu experiencia..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        rows={4}
        maxLength={500}
      />

      <button className={styles.btnEnviar} type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
};

export default ResenaForm;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { contactService } from "../../services/contact.service";
import { type ContactMessage } from "../../types/ContactMessage";
import { useToast } from "../../context/ToastContext";
import styles from "../../styles/contactos/ContactDetail.module.css";

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();

  const [mensaje, setMensaje] = useState<ContactMessage | null>(null);
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchDetalle = async () => {
    if (!id) return;
    try {
      const data = await contactService.getById(Number(id));
      setMensaje(data);
    } catch (err) {
      console.error(err);
      push("Error al cargar mensaje.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = async () => {
    if (!id || !respuesta.trim()) return;
    try {
      setSending(true);
      await contactService.update(Number(id), { respuesta });
      push("Respuesta enviada correctamente.", "success");
      fetchDetalle();
      setRespuesta("");
    } catch (err) {
      console.error(err);
      push("Error al responder mensaje.", "error");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando mensaje...</p>;
  if (!mensaje) return <p>No se encontró el mensaje.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h2>📬 Detalle del Mensaje</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.infoGroup}>
          <p><strong>👤 Nombre:</strong> {mensaje.nombre}</p>
          <p><strong>📧 Email:</strong> {mensaje.email}</p>
          <p><strong>📞 Teléfono:</strong> {mensaje.telefono || "—"}</p>
          <p><strong>💬 Canal preferido:</strong> {mensaje.canal_preferido}</p>
          <p><strong>📅 Fecha:</strong> {new Date(mensaje.created_at ?? "").toLocaleString("es-PE")}</p>
        </div>

        <div className={styles.messageBox}>
          <h4>Mensaje del usuario:</h4>
          <p className={styles.userMessage}>{mensaje.mensaje}</p>
        </div>

        <div className={styles.statusBox}>
          <span className={`${styles.estadoBadge} ${styles[mensaje.estado.toLowerCase()]}`}>
            {mensaje.estado}
          </span>
        </div>

        {mensaje.respuesta ? (
          <div className={styles.responseBox}>
            <h4>Respuesta del administrador:</h4>
            <p className={styles.adminResponse}>{mensaje.respuesta}</p>
            <small>
              📅 Respondido el:{" "}
              {mensaje.fecha_respuesta
                ? new Date(mensaje.fecha_respuesta).toLocaleString("es-PE")
                : "—"}
            </small>
          </div>
        ) : (
          <div className={styles.respuestaBox}>
            <h4>Responder al usuario:</h4>
            <textarea
              placeholder="Escribe tu respuesta..."
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
            />
            <button onClick={handleResponder} disabled={sending}>
              {sending ? "Enviando..." : "📨 Enviar respuesta"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;

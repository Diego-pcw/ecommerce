import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contactService } from "../../services/contact.service";
import { type ContactMessage } from "../../types/ContactMessage";
import { useToast } from "../../context/ToastContext";
import styles from "../../styles/contactos/ContactDetailUser.module.css";

const ContactDetailUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [mensaje, setMensaje] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetalle = async () => {
    if (!id) return;
    try {
      const data = await contactService.getById(Number(id));
      setMensaje(data);
    } catch (err) {
      console.error(err);
      push("Error al cargar el mensaje.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (!mensaje) return <p>No se encontró el mensaje.</p>;

  return (
    <div className={styles.container}>
      <h2>Detalle de tu mensaje</h2>
      <p><strong>Tu mensaje:</strong></p>
      <div className={styles.box}>{mensaje.mensaje}</div>

      <p><strong>Estado:</strong> {mensaje.estado}</p>

      {mensaje.respuesta ? (
        <>
          <h4>Respuesta del equipo:</h4>
          <div className={styles.respuestaBox}>{mensaje.respuesta}</div>
          <small>
            Respondido el:{" "}
            {mensaje.fecha_respuesta
              ? new Date(mensaje.fecha_respuesta).toLocaleString("es-PE")
              : "—"}
          </small>
        </>
      ) : (
        <p>Aún no hemos respondido tu mensaje. Te notificaremos pronto.</p>
      )}
    </div>
  );
};

export default ContactDetailUser;

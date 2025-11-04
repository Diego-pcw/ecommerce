import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { contactService } from "../../services/contact.service";
import {
  type ContactMessageCreateData,
  type ContactMessageResponse,
} from "../../types/ContactMessage";
import { Link } from "react-router-dom";
import styles from "../../styles/contactos/ContactForm.module.css";

const ContactForm: React.FC = () => {
  const { push } = useToast();

  const [mensaje, setMensaje] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canal, setCanal] =
    useState<"EMAIL" | "WHATSAPP" | "TELEFONO">("WHATSAPP");
  const [loading, setLoading] = useState(false);

  const [mensajeEnviado, setMensajeEnviado] = useState<{
    id: number;
    canal_preferido: string;
  } | null>(null);

  /** 📨 Enviar mensaje de contacto */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      push("Por favor escribe tu mensaje.", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload: ContactMessageCreateData = {
        mensaje,
        telefono: telefono || null,
        canal_preferido: canal,
      };

      const response: ContactMessageResponse = await contactService.create(payload);
      setMensajeEnviado({
        id: response.data.id,
        canal_preferido: response.data.canal_preferido,
      });

      push("Mensaje enviado correctamente.", "success");

      // Limpieza del formulario
      setMensaje("");
      setTelefono("");
    } catch (err) {
      console.error(err);
      push("Error al enviar el mensaje.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Contáctanos</h2>

        <textarea
          placeholder="Escribe tu mensaje..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <label>Canal preferido:</label>
        <select
          value={canal}
          onChange={(e) => setCanal(e.target.value as any)}
        >
          <option value="EMAIL">Correo electrónico</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="TELEFONO">Teléfono</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>

      {/* ✅ Mostrar enlace al detalle del mensaje una vez enviado */}
      {mensajeEnviado && (
        <div className={styles.detalleBox}>
          <p>Tu mensaje ha sido enviado correctamente.</p>
          <p>Puedes ver su estado y respuesta aquí:</p>
          <Link
            to={`/contacto/${mensajeEnviado.id}`}
            className={styles.btnDetalle}
          >
            Ver detalle
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContactForm;

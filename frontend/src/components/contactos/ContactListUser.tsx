import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contactService } from "../../services/contact.service";
import { type ContactMessage } from "../../types/ContactMessage";
import { useToast } from "../../context/ToastContext";
import styles from "../../styles/contactos/ContactListUser.module.css";

const ContactListUser: React.FC = () => {
  const { push } = useToast();
  const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMensajes = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();

      // Obtener usuario actual desde localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // 🔹 Filtrar solo los mensajes del usuario autenticado
      const userMessages = data.data.filter(
        (msg: ContactMessage) => msg.user_id === user.id
      );

      setMensajes(userMessages);
    } catch (err) {
      console.error(err);
      push("Error al cargar tus mensajes de contacto.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  if (loading) return <p className={styles.loading}>Cargando tus mensajes...</p>;

  return (
    <div className={styles.container}>
      <h2>Mis mensajes de contacto</h2>
      {mensajes.length === 0 ? (
        <p>No has enviado ningún mensaje todavía.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mensaje</th>
              <th>Canal</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((m) => (
              <tr key={m.id}>
                <td className={styles.truncate}>{m.mensaje}</td>
                <td>{m.canal_preferido}</td>
                <td>{m.estado}</td>
                <td>
                  {new Date(m.created_at ?? "").toLocaleDateString("es-PE")}
                </td>
                <td>
                  <Link to={`/contacto/${m.id}`} className={styles.btn}>
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactListUser;

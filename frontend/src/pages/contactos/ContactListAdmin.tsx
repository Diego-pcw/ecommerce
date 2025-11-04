import React, { useEffect, useState } from "react";
import { contactService } from "../../services/contact.service";
import { type ContactMessage } from "../../types/ContactMessage";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";
import styles from "../../styles/contactos/ContactListAdmin.module.css";

const ContactListAdmin: React.FC = () => {
  const { push } = useToast();
  const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);
  const [estadoFiltro, setEstadoFiltro] = useState<string>("");

  /** 🔄 Cargar mensajes con paginación y filtro */
  const fetchMensajes = async (page = 1, estado = estadoFiltro) => {
    try {
      setLoading(true);
      const params = { page, per_page: perPage, ...(estado ? { estado } : {}) };
      const data = await contactService.getAll(params);
      setMensajes(data.data);
      setCurrentPage(data.current_page);
      setLastPage(data.last_page);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      push("Error al cargar mensajes de contacto.", "error");
    } finally {
      setLoading(false);
    }
  };

  /** 🗑️ Eliminar mensaje */
  const handleDelete = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este mensaje? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    try {
      setDeletingId(id);
      await contactService.delete(id);
      push("Mensaje eliminado correctamente.", "success");
      setMensajes((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      push("No se pudo eliminar el mensaje.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  /** 🎨 Estado visual */
  const getEstadoClase = (estado: string) => {
    switch (estado) {
      case "RESPONDIDO":
        return styles.estadoRespondido;
      case "CERRADO":
        return styles.estadoCerrado;
      default:
        return styles.estadoNuevo;
    }
  };

  /** ⏩ Control de paginación */
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) fetchMensajes(newPage);
  };

  /** 🔍 Filtrar por estado */
  const handleFilterChange = (estado: string) => {
    setEstadoFiltro(estado === estadoFiltro ? "" : estado); // alternar si se hace clic dos veces
    fetchMensajes(1, estado === estadoFiltro ? "" : estado);
  };

  useEffect(() => {
    fetchMensajes();
  }, []);

  if (loading) return <p className={styles.loading}>Cargando mensajes...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Mensajes de Contacto</h2>
        <div className={styles.actions}>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchMensajes(currentPage)}
          >
            🔄 Recargar
          </button>
          <span className={styles.totalInfo}>
            Total: <strong>{total}</strong> mensajes
          </span>
        </div>
      </div>

      {/* 🔹 Filtros por estado */}
      <div className={styles.filterContainer}>
        <button
          className={`${styles.filterBtn} ${!estadoFiltro ? styles.activeFilter : ""}`}
          onClick={() => handleFilterChange("")}
        >
          Todos
        </button>
        <button
          className={`${styles.filterBtn} ${styles.nuevoFilter} ${
            estadoFiltro === "NUEVO" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterChange("NUEVO")}
        >
          Nuevo
        </button>
        <button
          className={`${styles.filterBtn} ${styles.respondidoFilter} ${
            estadoFiltro === "RESPONDIDO" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterChange("RESPONDIDO")}
        >
          Respondido
        </button>
        <button
          className={`${styles.filterBtn} ${styles.cerradoFilter} ${
            estadoFiltro === "CERRADO" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterChange("CERRADO")}
        >
          Cerrado
        </button>
      </div>

      {mensajes.length === 0 ? (
        <p>No hay mensajes disponibles.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Canal</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {mensajes.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.email}</td>
                  <td>{m.canal_preferido}</td>
                  <td>
                    <span
                      className={`${styles.estadoBadge} ${getEstadoClase(m.estado)}`}
                    >
                      {m.estado}
                    </span>
                  </td>
                  <td>
                    {new Date(m.created_at ?? "").toLocaleDateString("es-PE")}
                  </td>
                  <td>
                    <Link to={`/admin/contactos/${m.id}`} className={styles.btn}>
                      Ver detalle
                    </Link>
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? "Eliminando..." : "🗑️ Borrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🔹 Paginación */}
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ◀ Anterior
            </button>

            <span className={styles.pageInfo}>
              Página {currentPage} de {lastPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className={styles.pageBtn}
            >
              Siguiente ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactListAdmin;

import React, { useEffect, useState } from "react";
import carritoService from "../../services/carrito.service";
import { type Carrito, type CarritoResumen } from "../../types/Carrito";
import { useToast } from "../../context/ToastContext";

const CarritoList: React.FC = () => {
  const { push } = useToast();
  const [carritos, setCarritos] = useState<Carrito[]>([]);
  const [resumen, setResumen] = useState<CarritoResumen | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarritos = async () => {
    try {
      const res = await carritoService.listarCarritos();

      // 🔹 Verificamos estructura exacta del backend
      const lista = res?.carritos?.data ?? [];
      setCarritos(lista);

      // 🔹 Guardamos el resumen (total, activos, expirados, etc.)
      setResumen(res.resumen);
    } catch (error) {
      console.error("Error al cargar los carritos:", error);
      push("❌ Error al cargar los carritos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarritos();
  }, []);

  if (loading) return <p>Cargando carritos...</p>;

  return (
    <div className="carrito-list-container">
      <h2 className="mb-2">🛒 Lista de Carritos</h2>

      {/* 🔹 Mostrar resumen estadístico si existe */}
      {resumen && (
        <div className="carrito-resumen mb-3">
          <p>
            <strong>Total:</strong> {resumen.total} |{" "}
            <strong>Activos:</strong> {resumen.activos} |{" "}
            <strong>Expirados:</strong> {resumen.expirados} |{" "}
            <strong>Fusionados:</strong>{" "}
            {"fusionado" in resumen ? resumen.fusionados : 0} |{" "}
            <strong>Vacíos:</strong> {resumen.vacios}
          </p>
        </div>
      )}

      {/* 🔹 Tabla de carritos */}
      {carritos.length === 0 ? (
        <p>No hay carritos registrados.</p>
      ) : (
        <table className="carrito-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario / Sesión</th>
              <th>Estado</th>
              <th>Productos</th>
              <th>Total (estimado)</th>
              <th>Última actualización</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carritos.map((c) => {
              const total =
                c.detalles?.reduce(
                  (acc, d) => acc + (d.cantidad ?? 0) * (d.precio_unitario ?? 0),
                  0
                ) ?? 0;

              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    {c.usuario?.name
                      ? c.usuario.name
                      : c.session_id
                      ? `Sesión: ${c.session_id.slice(0, 8)}...`
                      : "Invitado"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        c.estado === "activo"
                          ? "badge-success"
                          : c.estado === "fusionado"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td>{c.detalles?.length ?? 0}</td>
                  <td>S/ {total.toFixed(2)}</td>
                  <td>
                    {new Date(c.updated_at ?? "").toLocaleString("es-PE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>
                    <a
                      href={`/carritos/${c.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Ver detalles
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CarritoList;

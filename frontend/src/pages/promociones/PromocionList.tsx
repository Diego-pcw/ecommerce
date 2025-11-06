import React, { useEffect, useState } from "react";
import { promocionService } from "../../services/promocion.service";
import type { Promocion } from "../../types/Promocion";
import { Link } from "react-router-dom";

const PromocionList: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromociones = async () => {
    try {
      const res = await promocionService.listar();
      setPromociones(res.data);
    } catch (error) {
      console.error("Error al obtener promociones:", error);
      alert("❌ No se pudieron cargar las promociones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromociones();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta promoción?")) return;

    try {
      await promocionService.eliminar(id);
      setPromociones((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Promoción eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar promoción:", error);
      alert("❌ No se pudo eliminar la promoción.");
    }
  };

  if (loading) return <p>Cargando promociones...</p>;

  return (
    <div className="container mt-4">
      <h2>🎯 Lista de Promociones</h2>
      <Link to="/promociones/crear" className="btn btn-primary mb-3">
        ➕ Nueva Promoción
      </Link>

      {promociones.length === 0 ? (
        <p>No hay promociones registradas.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Descuento</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promociones.map((p) => (
              <tr key={p.id}>
                <td>{p.titulo}</td>
                <td>{p.descuento_tipo === "percent" ? "Porcentaje" : "Monto fijo"}</td>
                <td>
                  {p.descuento_tipo === "percent"
                    ? `${p.descuento_valor}%`
                    : `S/ ${Number(p.descuento_valor).toFixed(2)}`}
                </td>
                <td>{new Date(p.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(p.fecha_fin).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      p.estado?.toLowerCase() === "activo"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {p.estado?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/promociones/${p.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/promociones/editar/${p.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Editar
                  </Link>
                  {/* 🧩 Nuevo botón para asignar productos */}
                  <Link
                    to={`/promociones/${p.id}/asignar/`}
                    className="btn btn-sm btn-success me-2"
                  >
                    Asignar productos
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PromocionList;

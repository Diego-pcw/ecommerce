import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { promocionService } from "../../services/promocion.service";
import type { Promocion } from "../../types/Promocion";

const PromocionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromocion = async () => {
      if (!id || isNaN(Number(id))) {
        setError("ID de promoción inválido.");
        setLoading(false);
        return;
      }

      try {
        const data = await promocionService.obtener(Number(id));
        setPromocion(data);
      } catch (error) {
        console.error("❌ Error al obtener promoción:", error);
        setError("No se pudo cargar la promoción.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromocion();
  }, [id]);

  if (loading) return <p>Cargando promoción...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!promocion) return <p>No se encontró la promoción.</p>;

  return (
    <div className="container mt-4">
      <h2>🎯 Detalle de Promoción</h2>
      <div className="card p-3 shadow-sm mt-3">
        <h4>{promocion.titulo}</h4>
        <p>{promocion.descripcion || "Sin descripción disponible."}</p>

        <p>
          <strong>Tipo de Descuento:</strong>{" "}
          {promocion.descuento_tipo === "percent" ? "Porcentaje" : "Monto fijo"}
        </p>

        <p>
          <strong>Valor del Descuento:</strong>{" "}
          {promocion.descuento_tipo === "percent"
            ? `${promocion.descuento_valor}%`
            : `S/ ${Number(promocion.descuento_valor).toFixed(2)}`}
        </p>

        <p>
          <strong>Vigencia:</strong>{" "}
          {new Date(promocion.fecha_inicio).toLocaleDateString()} –{" "}
          {new Date(promocion.fecha_fin).toLocaleDateString()}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={`badge ${
              promocion.estado?.toLowerCase() === "activo"
                ? "bg-success"
                : "bg-secondary"
            }`}
          >
            {promocion.estado?.toUpperCase()}
          </span>
        </p>

        <h5 className="mt-4">📦 Productos en Promoción</h5>
        {promocion.productos && promocion.productos.length > 0 ? (
          <ul className="list-group">
            {promocion.productos.map((prod) => (
              <li key={prod.id} className="list-group-item">
                <strong>{prod.nombre}</strong> — S/{" "}
                {Number(prod.precio ?? 0).toFixed(2)}
                {prod.precio_con_descuento && (
                  <span className="text-success ms-2">
                    (S/ {Number(prod.precio_con_descuento).toFixed(2)} con descuento)
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos asignados.</p>
        )}
      </div>

      <Link to="/promociones" className="btn btn-secondary mt-3">
        ← Volver a la lista
      </Link>
    </div>
  );
};

export default PromocionDetail;

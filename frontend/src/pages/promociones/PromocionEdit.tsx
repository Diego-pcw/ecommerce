import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { promocionService } from "../../services/promocion.service";
import type { Promocion, PromocionUpdateData } from "../../types/Promocion";

const PromocionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromocion = async () => {
      try {
        const data = await promocionService.obtener(Number(id));
        setPromocion({
          ...data,
          descuento_valor: Number(data.descuento_valor).toFixed(2),
        });
      } catch (error) {
        console.error("❌ Error al cargar promoción:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromocion();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPromocion((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "descuento_valor" ? value.replace(/[^0-9.]/g, "") : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promocion) return;

    const valor = parseFloat(promocion.descuento_valor as unknown as string);
    if (isNaN(valor) || valor < 0.01) {
      alert("El valor del descuento debe ser mayor a 0.01.");
      return;
    }

    try {
      const payload: PromocionUpdateData = {
        titulo: promocion.titulo,
        descripcion: promocion.descripcion,
        descuento_tipo: promocion.descuento_tipo,
        descuento_valor: valor.toFixed(2),
        fecha_inicio: promocion.fecha_inicio,
        fecha_fin: promocion.fecha_fin,
        estado: promocion.estado,
      };

      await promocionService.actualizar(Number(id), payload);
      alert("✅ Promoción actualizada correctamente.");
      navigate("/promociones");
    } catch (error) {
      console.error("❌ Error al actualizar promoción:", error);
      alert("No se pudo actualizar la promoción.");
    }
  };

  if (loading) return <p>Cargando promoción...</p>;
  if (!promocion) return <p>No se encontró la promoción.</p>;

  return (
    <div className="container mt-4">
      <h2>✏️ Editar Promoción</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            className="form-control"
            value={promocion.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={promocion.descripcion ?? ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Descuento</label>
            <select
              name="descuento_tipo"
              className="form-select"
              value={promocion.descuento_tipo}
              onChange={handleChange}
            >
              <option value="percent">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (S/)</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Valor ({promocion.descuento_tipo === "percent" ? "%" : "S/"})
            </label>
            <input
              type="text"
              name="descuento_valor"
              className="form-control"
              value={promocion.descuento_valor ?? ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              className="form-control"
              value={promocion.fecha_inicio?.slice(0, 10) ?? ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha Fin</label>
            <input
              type="date"
              name="fecha_fin"
              className="form-control"
              value={promocion.fecha_fin?.slice(0, 10) ?? ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            name="estado"
            className="form-select"
            value={promocion.estado}
            onChange={handleChange}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Actualizar
        </button>
      </form>
    </div>
  );
};

export default PromocionEdit;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { promocionService } from "../../services/promocion.service";
import type { PromocionCreateData } from "../../types/Promocion";

const PromocionCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PromocionCreateData>({
    titulo: "",
    descripcion: "",
    descuento_tipo: "percent",
    descuento_valor: "0.01",
    fecha_inicio: "",
    fecha_fin: "",
    estado: "ACTIVO",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "descuento_valor" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseFloat(formData.descuento_valor);

    if (isNaN(valor) || valor < 0.01) {
      alert("El valor del descuento debe ser mayor a 0.01.");
      return;
    }

    try {
      await promocionService.crear({
        ...formData,
        descuento_valor: valor.toFixed(2),
      });
      alert("✅ Promoción creada correctamente.");
      navigate("/promociones");
    } catch (error) {
      console.error("❌ Error al crear promoción:", error);
      alert("Error al crear promoción.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>➕ Nueva Promoción</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="titulo"
            className="form-control"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
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
              value={formData.descuento_tipo}
              onChange={handleChange}
            >
              <option value="percent">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (S/)</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Valor ({formData.descuento_tipo === "percent" ? "%" : "S/"})
            </label>
            <input
              type="text"
              name="descuento_valor"
              className="form-control"
              value={formData.descuento_valor}
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
              value={formData.fecha_inicio}
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
              value={formData.fecha_fin}
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
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default PromocionCreate;

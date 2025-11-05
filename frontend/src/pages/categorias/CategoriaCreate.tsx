// src/pages/categorias/CategoriaCreate.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoriaService } from "../../services/categoria.service";
import type { CategoriaCreateData } from "../../types/Categoria";
import "../../styles/categorias/categorias.shared.css";

const CategoriaCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CategoriaCreateData>({
    nombre: "",
    descripcion: "",
    estado: "activo",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await categoriaService.crear(formData);
      alert("✅ Categoría creada exitosamente");
      navigate("/categorias");
    } catch (error) {
      console.error("❌ Error al crear la categoría:", error);
      alert("No se pudo crear la categoría, inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="categoria-form-container">
      <h2 className="categoria-title">Crear Nueva Categoría</h2>

      <form onSubmit={handleSubmit} className="categoria-form">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Herramientas eléctricas"
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Breve descripción de la categoría"
          />
        </label>

        <label>
          Estado:
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>

        <div className="categoria-form-actions">
          <button type="button" onClick={() => navigate("/categorias")} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaCreate;

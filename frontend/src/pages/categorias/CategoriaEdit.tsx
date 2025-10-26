// src/pages/categorias/CategoriaEdit.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { categoriaService } from "../../services/categoria.service";
import type { CategoriaUpdateData, Categoria } from "../../types/Categoria";
import "../../styles/categorias.shared.css";

const CategoriaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoriaUpdateData>({
    nombre: "",
    descripcion: "",
    estado: "activo",
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Editar Categoría | Panel";
    const fetchCategoria = async () => {
      try {
        setLoading(true);
        const data: Categoria = await categoriaService.obtenerPorId(Number(id));
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          estado: data.estado,
        });
      } catch (error) {
        console.error("❌ Error al obtener la categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoria();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoriaService.actualizar(Number(id), formData);
      alert("✅ Categoría actualizada correctamente");
      navigate("/categorias");
    } catch (error) {
      console.error("❌ Error al actualizar la categoría:", error);
      alert("No se pudo actualizar la categoría, inténtalo más tarde.");
    }
  };

  if (loading) return <div className="categoria-loader">Cargando datos...</div>;

  return (
    <div className="categoria-form-container">
      <h2 className="categoria-title">Editar Categoría</h2>
      <form onSubmit={handleSubmit} className="categoria-form">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
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

        <div className="categoria-buttons">
          <button type="submit" className="btn-guardar" disabled={loading}>
            💾 Guardar
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/categorias")}
            disabled={loading}
          >
            ✖ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriaEdit;

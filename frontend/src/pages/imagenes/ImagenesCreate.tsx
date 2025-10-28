import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { imagenProductoService } from "../../services/imagenproducto.service";
import type { ImagenProductoCreateData } from "../../types/ImagenProducto";

const ImagenesCreate: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ImagenProductoCreateData>>({});
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // 🔹 Manejadores
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagenFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagenFile || !formData.producto_id) {
      alert("Debes seleccionar un producto y una imagen");
      return;
    }

    try {
      const payload: ImagenProductoCreateData = {
        producto_id: Number(formData.producto_id),
        imagen: imagenFile,
        alt_text: formData.alt_text ?? "",
        principal: formData.principal ?? false,
        orden: Number(formData.orden) || 1,
      };

      const res = await imagenProductoService.crear(payload);
      setMensaje(res.message || "Imagen subida correctamente ✅");

      // 🔸 Reiniciar formulario
      setFormData({});
      setImagenFile(null);
      setPreview(null);
      setTimeout(() => navigate("/imagenes"), 1200);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setMensaje("❌ Error al subir la imagen");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">🖼️ Nueva Imagen</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="producto_id"
          placeholder="ID del Producto"
          value={formData.producto_id ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
          required
        />

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-lg border mt-2"
          />
        )}

        <input
          type="text"
          name="alt_text"
          placeholder="Texto alternativo"
          value={formData.alt_text ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="orden"
          placeholder="Orden de visualización"
          value={formData.orden ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Subir Imagen
        </button>
      </form>

      {mensaje && <p className="mt-4 text-center text-green-600">{mensaje}</p>}
    </div>
  );
};

export default ImagenesCreate;

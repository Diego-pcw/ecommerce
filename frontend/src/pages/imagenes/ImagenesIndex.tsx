import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imagenProductoService } from "../../services/imagenproducto.service";
import type { ImagenProducto } from "../../types/ImagenProducto";

const ImagenesIndex: React.FC = () => {
  const [imagenes, setImagenes] = useState<ImagenProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // 🔹 Cargar todas las imágenes
  useEffect(() => {
    const fetchImagenes = async () => {
      try {
        const res = await imagenProductoService.obtenerTodas();
        // 🧠 Aseguramos que siempre sea un array
        setImagenes(res.data);
      } catch (error) {
        console.error("Error al cargar las imágenes:", error);
        setMensaje("❌ Error al cargar las imágenes desde el servidor.");
      } finally {
        setLoading(false);
      }
    };
    fetchImagenes();
  }, []);

  // 🔹 Eliminar imagen
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta imagen?")) return;

    try {
      await imagenProductoService.eliminar(id);
      setImagenes((prev) => prev.filter((img) => img.id !== id));
      setMensaje("🗑️ Imagen eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      setMensaje("❌ No se pudo eliminar la imagen.");
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando imágenes...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📸 Imágenes de Productos</h1>
        <button
          onClick={() => navigate("/imagenes/crear")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Nueva Imagen
        </button>
      </div>

      {mensaje && (
        <p className="mb-4 text-center text-blue-600 font-medium">{mensaje}</p>
      )}

      {imagenes.length === 0 ? (
        <p>No hay imágenes registradas.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imagenes.map((img) => (
            <div
              key={img.id}
              className="border rounded-lg p-2 text-center shadow hover:shadow-md transition"
            >
              <img
                src={img.url}
                alt={img.alt_text ?? "Sin descripción"}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-700 mb-1">
                {img.alt_text ?? "Sin texto alternativo"}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Estado:{" "}
                {img.estado?.toLowerCase() === "activo"
                  ? "🟢 Activo"
                  : "🔴 Inactivo"}
              </p>

              {/* Botones de acción */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => navigate(`/imagenes/${img.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Ver"
                >
                  👁️
                </button>
                <button
                  onClick={() => navigate(`/imagenes/editar/${img.id}`)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleEliminar(img.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagenesIndex;

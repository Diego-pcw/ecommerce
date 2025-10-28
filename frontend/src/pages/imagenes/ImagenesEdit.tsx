import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { imagenProductoService } from "../../services/imagenproducto.service";
import type {
  ImagenProducto,
  ImagenProductoUpdateData,
} from "../../types/ImagenProducto";

const ImagenesEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [imagen, setImagen] = useState<ImagenProducto | null>(null);
  const [nuevoArchivo, setNuevoArchivo] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("Acceso denegado. Debes iniciar sesión.");
          return;
        }

        // ⚙️ Petición GET /api/imagenes/:id
        const res = await imagenProductoService.obtenerTodas();
        const imagenEncontrada = res.data.find((img) => img.id === Number(id));

        if (imagenEncontrada) setImagen(imagenEncontrada);
        else setMensaje("Imagen no encontrada ❌");
      } catch (err) {
        console.error("Error al obtener la imagen:", err);
        setMensaje("Error al cargar los datos ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Enviar actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen || !id) return;

    const data: ImagenProductoUpdateData = {
      imagen: nuevoArchivo ?? undefined,
      alt_text: imagen.alt_text,
      estado: "activo",
    };

    try {
      const res = await imagenProductoService.actualizar(Number(id), data);
      setMensaje(res.message || "Imagen actualizada correctamente ✅");

      // Redirige tras 2 segundos al listado
      setTimeout(() => navigate("/imagenes"), 2000);
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar la imagen ❌");
    }
  };

  if (loading) return <p className="text-center mt-6">Cargando imagen...</p>;

  if (!imagen)
    return <p className="text-center mt-6 text-red-500">{mensaje || "Imagen no disponible."}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        ✏️ Editar Imagen #{imagen.id}
      </h1>

      <img
        src={imagen.url}
        alt={imagen.alt_text ?? ""}
        className="rounded-lg mb-4 w-full h-52 object-cover shadow"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">📷 Nueva imagen</label>
          <input
            type="file"
            onChange={(e) => e.target.files && setNuevoArchivo(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">📝 Texto alternativo</label>
          <input
            type="text"
            placeholder="Descripción o texto alternativo"
            value={imagen.alt_text ?? ""}
            onChange={(e) => setImagen({ ...imagen, alt_text: e.target.value })}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Guardar Cambios
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 text-center text-blue-600 font-medium">{mensaje}</p>
      )}
    </div>
  );
};

export default ImagenesEdit;

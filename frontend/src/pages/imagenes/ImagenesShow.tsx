import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { imagenProductoService } from "../../services/imagenproducto.service";
import type { ImagenProductoPorProductoResponse } from "../../types/ImagenProducto";

const ImagenesShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imagenes, setImagenes] = useState<ImagenProductoPorProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const res = await imagenProductoService.obtenerPorProducto(Number(id));
        setImagenes(res);
      } catch (err) {
        console.error("Error al obtener imágenes por producto:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Cargando imágenes...</p>;

  if (!imagenes)
    return <p className="text-center mt-6 text-gray-600">No se encontraron imágenes.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        📦 Imágenes del Producto #{imagenes.producto_id}
      </h1>

      {imagenes.principal && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Imagen Principal</h2>
          <img
            src={imagenes.principal.url}
            alt={imagenes.principal.alt_text ?? ""}
            className="w-full h-48 object-cover rounded-lg border shadow-md"
          />
        </div>
      )}

      {imagenes.secundarias.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">Otras Imágenes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {imagenes.secundarias.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={img.alt_text ?? ""}
                className="w-full h-32 object-cover rounded border shadow-sm hover:shadow-md transition"
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No hay imágenes secundarias registradas.</p>
      )}
    </div>
  );
};

export default ImagenesShow;

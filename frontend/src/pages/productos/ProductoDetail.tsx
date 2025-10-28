import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productoService } from "../../services/producto.service";
import type { Producto } from "../../types/Producto";

const ProductoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        if (id) {
          const data = await productoService.obtenerPorId(Number(id));
          setProducto(data);
        }
      } catch (err) {
        console.error("Error al obtener producto:", err);
        setError("Error al obtener los detalles del producto ❌");
      }
    };
    fetchProducto();
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  // 💰 Precio final (si no hay, usa 0)
  const precio = producto.precio_final ?? 0;

  // 📦 Nombre de categoría (string u objeto)
  const categoriaNombre =
    typeof producto.categoria === "string"
      ? producto.categoria
      : producto.categoria?.nombre ?? "—";

  // ⚙️ Estado (ya viene del backend)
  const estado =
    producto.estado?.toLowerCase() === "activo"
      ? "🟢 Activo"
      : producto.estado?.toLowerCase() === "inactivo"
      ? "🔴 Inactivo"
      : "⚪ No especificado";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>

      {/* 🖼️ Galería de imágenes */}
      {producto.imagenes && producto.imagenes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {producto.imagenes.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={producto.nombre}
              className="rounded border object-cover w-full h-40"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No hay imágenes disponibles.</p>
      )}

      {/* 📋 Detalles del producto */}
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Marca:</strong> {producto.marca ?? "Sin marca"}
        </p>
        <p>
          <strong>Categoría:</strong> {categoriaNombre}
        </p>
        <p>
          <strong>Descripción:</strong> {producto.descripcion ?? "Sin descripción"}
        </p>
        <p>
          <strong>Stock:</strong> {producto.stock ?? 0}
        </p>
        <p>
          <strong>Estado:</strong> {estado}
        </p>
      </div>

      {/* 💰 Precio final */}
      <p className="text-lg font-semibold text-green-600 mt-4">
        💰 S/ {precio.toFixed(2)}
      </p>

      {/* 🎟️ Promoción vigente */}
      {producto.promocion_vigente && (
        <div className="mt-3 bg-blue-50 p-2 rounded">
          <p className="text-sm text-blue-700">
            🔖 Promoción: {producto.promocion_vigente.titulo} (
            {producto.promocion_vigente.tipo === "percent"
              ? `${producto.promocion_vigente.valor}%`
              : `S/ ${producto.promocion_vigente.valor}`}
            )
          </p>
          <p className="text-xs text-blue-500">
            Vigencia: {producto.promocion_vigente.fecha_inicio} –{" "}
            {producto.promocion_vigente.fecha_fin}
          </p>
        </div>
      )}

      {/* 🔙 Botón volver */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/productos")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Volver a la lista
        </button>
      </div>
    </div>
  );
};

export default ProductoDetail;

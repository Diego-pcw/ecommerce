// src/pages/admin/productos/ProductosOfertas.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productoService } from "../../../services/producto.service";
import type { ProductoListItem } from "../../../types/Producto";
import ProductoCard from "../../../components/productos/ProductoCard";

const ProductosOfertas: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        const data = await productoService.obtenerConOfertas();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos con ofertas:", err);
        setError("No se pudieron cargar las ofertas ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  if (loading) return <p className="p-6">Cargando productos en oferta...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">🏷️ Productos con Ofertas Activas</h1>
        <button
          onClick={() => navigate("/productos")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          ← Volver
        </button>
      </div>

      {productos.length === 0 ? (
        <p>No hay productos con promociones activas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="border p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <ProductoCard producto={prod} />
              <p className="mt-2 text-green-600 font-semibold">
                💸 {prod.promocion_vigente?.valor}% de descuento
              </p>
              <p className="text-gray-800">
                <span className="line-through text-gray-400 mr-2">
                  S/ {Number(prod.precio_original).toFixed(2)}
                </span>
                <span className="text-green-600 font-bold">
                  S/ {Number(prod.precio_final).toFixed(2)}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosOfertas;

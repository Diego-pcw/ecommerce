//Queda pendiente a corregir
import React, { useEffect, useState } from "react";
import { productoService } from "../../services/producto.service";
import ProductoCard from "../../components/productos/ProductoCard";
import type { ProductoListItem } from "../../types/Producto";
import styles from "../../styles/carritos/Carrito.module.css"; // reutiliza estilos de precios

const CatalogoProduct: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 🔹 Cargar productos al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await productoService.obtenerTodos();
        setProductos(res.data ?? []);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 🔍 Filtro de búsqueda
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Cargando catálogo...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        🛍️ Catálogo de Productos
      </h1>

      {/* 🔍 Búsqueda */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full md:w-1/2 shadow-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* 📦 Listado */}
      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600">
          No se encontraron productos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((prod) => {
            const tieneDescuento =
              prod.promocion_vigente &&
              prod.promocion_vigente.tipo === "percent" &&
              prod.promocion_vigente.valor > 0;

            return (
              <div
                key={prod.id}
                className="border p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white"
              >
                {/* Tarjeta del producto */}
                <ProductoCard producto={prod} mostrarPrecio />

                {/* 🎯 Promoción */}
                {tieneDescuento && (
                  <p className="mt-2 text-sm text-green-600 font-semibold">
                    🏷️ {prod.promocion_vigente?.valor}% de descuento
                  </p>
                )}

                {/* 💰 Precios */}
                <div className="mt-2">
                  {tieneDescuento ? (
                    <>
                      <p className={styles["precio-original"]}>
                        S/ {Number(prod.precio_original).toFixed(2)}
                      </p>
                      <p className={styles["precio-final"]}>
                        S/ {Number(prod.precio_final).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className={styles["precio-final"]}>
                      S/ {Number(prod.precio_final ?? prod.precio_original).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogoProduct;

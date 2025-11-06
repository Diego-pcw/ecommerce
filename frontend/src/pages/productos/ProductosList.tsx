import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productoService } from "../../services/producto.service";
import type { ProductoListItem } from "../../types/Producto";
import ProductoCard from "../../components/productos/ProductoCard";
import styles from "../../styles/carritos/Carrito.module.css"; // ✅ reutilizamos los estilos de precio

const ProductosList: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

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

  const handleCreate = () => navigate("/productos/crear");
  const handleEdit = (id: number) => navigate(`/productos/editar/${id}`);
  const handleDetail = (id: number) => navigate(`/productos/${id}`);
  const handleDelete = async (id: number) => {
    const ok = confirm(
      "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
    );
    if (!ok) return;
    try {
      setDeletingId(id);
      await productoService.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("No se pudo eliminar el producto ❌");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="p-6">Cargando productos...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📦 Lista de Productos</h1>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productos.map((prod) => {
            const tieneDescuento =
              prod.promocion_vigente &&
              prod.promocion_vigente.tipo === "percent" &&
              prod.promocion_vigente.valor > 0;

            return (
              <div
                key={prod.id}
                className="border p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                {/* ✅ ProductoCard ya no muestra precio */}
                <ProductoCard producto={prod} mostrarPrecio={false} />

                {tieneDescuento && (
                  <p className="mt-2 text-sm text-green-600 font-semibold">
                    🏷️ {prod.promocion_vigente?.valor}% de descuento
                  </p>
                )}

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

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDetail(prod.id)}
                    className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    🔍 Ver
                  </button>
                  <button
                    onClick={() => handleEdit(prod.id)}
                    className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    disabled={deletingId === prod.id}
                  >
                    {deletingId === prod.id ? "Eliminando..." : "🗑️ Eliminar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductosList;

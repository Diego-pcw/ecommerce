import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productoService } from "../../services/producto.service";
import { categoriaService } from "../../services/categoria.service"; // ✅ Para obtener categorías
import type { Producto, ProductoUpdateData } from "../../types/Producto";
import type { Categoria } from "../../types/Categoria";

const ProductoEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductoUpdateData>({});
  const [producto, setProducto] = useState<Producto | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]); // ✅ Tipado correcto
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------
   * 🔹 Cargar producto y categorías
   * ----------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // ✅ Cargar producto
        const data = await productoService.obtenerPorId(Number(id));
        setProducto(data);

        // ✅ Cargar categorías
        const resCategorias = await categoriaService.obtenerTodas();
        const listaCategorias = Array.isArray(resCategorias)
          ? resCategorias
          : resCategorias.data ?? [];

        setCategorias(listaCategorias);

        // ✅ Prellenar formulario
        setForm({
          nombre: data.nombre,
          marca: data.marca ?? "",
          descripcion: data.descripcion ?? "",
          precio: parseFloat(data.precio_original) || data.precio_final || 0,
          stock: data.stock ?? 0,
          categoria_id:
            data.categoria_id ??
            data.categoria?.id ??
            (listaCategorias[0]?.id ?? 0),
          estado: data.estado ?? "activo",
        });
      } catch (error) {
        console.error("Error al cargar producto o categorías:", error);
        setMensaje("❌ No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* -------------------------------------------
   * 🔹 Manejar envío del formulario
   * ----------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const res = await productoService.actualizar(Number(id), form);
      setMensaje(res.message || "✅ Producto actualizado correctamente");

      // Redirigir después de un pequeño retraso
      setTimeout(() => navigate("/productos"), 1500);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setMensaje("❌ Error al actualizar el producto.");
    }
  };

  /* -------------------------------------------
   * 🔹 Renderizado condicional
   * ----------------------------------------- */
  if (loading) return <p className="text-center mt-6">Cargando producto...</p>;
  if (!producto)
    return <p className="text-center mt-6">No se encontró el producto.</p>;

  /* -------------------------------------------
   * 🔹 Vista principal del formulario
   * ----------------------------------------- */
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Editar Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.nombre ?? ""}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-semibold mb-1">Marca</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={form.marca ?? ""}
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea
            className="border p-2 w-full rounded resize-none"
            rows={3}
            value={form.descripcion ?? ""}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-semibold mb-1">Precio (S/)</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={form.precio ?? 0}
            min="0"
            step="0.01"
            onChange={(e) =>
              setForm({ ...form, precio: parseFloat(e.target.value) || 0 })
            }
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold mb-1">Stock</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={form.stock ?? 0}
            min="0"
            onChange={(e) =>
              setForm({ ...form, stock: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría</label>
          <select
            className="border p-2 w-full rounded"
            value={form.categoria_id ?? ""}
            onChange={(e) =>
              setForm({ ...form, categoria_id: Number(e.target.value) })
            }
            required
          >
            <option value="">Selecciona una categoría</option>
            {Array.isArray(categorias) &&
              categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-semibold mb-1">Estado</label>
          <select
            className="border p-2 w-full rounded"
            value={form.estado ?? "activo"}
            onChange={(e) =>
              setForm({
                ...form,
                estado: e.target.value as "activo" | "inactivo",
              })
            }
          >
            <option value="activo">🟢 Activo</option>
            <option value="inactivo">🔴 Inactivo</option>
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition-colors"
        >
          Guardar Cambios
        </button>
      </form>

      {/* Mensaje de estado */}
      {mensaje && (
        <p
          className={`mt-4 text-center font-medium ${
            mensaje.includes("Error") || mensaje.includes("❌")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default ProductoEdit;

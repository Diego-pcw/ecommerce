import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productoService } from "../../services/producto.service";
import { categoriaService } from "../../services/categoria.service"; // ✅ Nuevo: para cargar categorías
import type { ProductoCreateData } from "../../types/Producto";
import type { Categoria } from "../../types/Categoria";

const ProductoCreate: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductoCreateData>({
    nombre: "",
    marca: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria_id: 1,
    estado: "activo",
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]); // ✅ Lista de categorías
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------
   * 🔹 Cargar categorías al montar el componente
   * ----------------------------------------- */
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await categoriaService.obtenerTodas();
        const listaCategorias = Array.isArray(res)
          ? res
          : res.data ?? [];
        setCategorias(listaCategorias);

        // Si no hay categoría seleccionada, asigna la primera por defecto
        if (listaCategorias.length > 0) {
          setForm((prev) => ({
            ...prev,
            categoria_id: listaCategorias[0].id,
          }));
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  /* -------------------------------------------
   * 🔹 Manejar cambios de formulario
   * ----------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "stock" || name === "categoria_id"
          ? Number(value)
          : value,
    }));
  };

  /* -------------------------------------------
   * 🔹 Manejar envío del formulario
   * ----------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await productoService.crear(form);
      setMensaje(res.message || "✅ Producto creado correctamente");
      setTimeout(() => navigate("/productos"), 1200);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------
   * 🔹 Render
   * ----------------------------------------- */
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">➕ Crear Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="nombre"
          className="border p-2 w-full rounded"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <input
          name="marca"
          className="border p-2 w-full rounded"
          placeholder="Marca"
          value={form.marca ?? ""}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          className="border p-2 w-full rounded"
          placeholder="Descripción"
          value={form.descripcion ?? ""}
          onChange={handleChange}
        />

        <input
          type="number"
          name="precio"
          className="border p-2 w-full rounded"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          min={0}
          required
        />

        <input
          type="number"
          name="stock"
          className="border p-2 w-full rounded"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          min={0}
          required
        />

        {/* ✅ Selector dinámico de categorías */}
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría</label>
          <select
            name="categoria_id"
            className="border p-2 w-full rounded"
            value={form.categoria_id}
            onChange={handleChange}
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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>

      {mensaje && <p className="mt-4 text-center text-green-600">{mensaje}</p>}
    </div>
  );
};

export default ProductoCreate;

import React, { useState } from "react";
import { useCarritoContext } from "../../context/CarritoContext";
import { useToast } from "../../context/ToastContext";
import type { ProductoListItem } from "../../types/Producto";

/**
 * 🧱 Tarjeta individual de producto con botón "Agregar al carrito"
 * Reutilizable en listados, secciones o vistas personalizadas.
 */
interface Props {
  producto: ProductoListItem;
}

const ProductoCard: React.FC<Props> = ({ producto }) => {
  const { agregarProducto } = useCarritoContext();
  const { push } = useToast();
  const [adding, setAdding] = useState(false);

  const handleAgregar = async () => {
    if (adding) return;
    try {
      setAdding(true);
      await agregarProducto({
        producto_id: producto.id,
        cantidad: 1,
      });
      push("✅ Producto agregado al carrito", "success");
    } catch (err) {
      console.error("Error al agregar producto:", err);
      push("❌ No se pudo agregar el producto", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="border p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {producto.imagenes?.[0] && (
          <img
            src={producto.imagenes[0].url}
            alt={producto.nombre}
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}
        <h2 className="font-bold text-lg">{producto.nombre}</h2>
        <p className="text-sm text-gray-600">{producto.categoria}</p>
        <p className="text-green-700 font-semibold mt-2">
          S/ {Number(producto.precio_final).toFixed(2)}
        </p>
        {producto.promocion_vigente && (
          <span className="text-sm text-blue-600 block mt-1">
            {producto.promocion_vigente.titulo} 🔖
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAgregar}
          disabled={adding}
          className="flex-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
        >
          {adding ? "Agregando..." : "🛒 Agregar"}
        </button>
      </div>
    </article>
  );
};

export default ProductoCard;

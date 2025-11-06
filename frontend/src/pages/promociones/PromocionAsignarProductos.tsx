import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { promocionService } from "../../services/promocion.service";
import { productoService } from "../../services/producto.service";
import type { Producto } from "../../types/Producto";
import "../../styles/promociones/PromocionAsignarProductos.css";

const PromocionAsignarProductos: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [asignados, setAsignados] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [todosProductos, promo] = await Promise.all([
          productoService.obtenerTodos({ estado: "activo" }),
          promocionService.obtener(Number(id)),
        ]);

        setProductos(todosProductos.data || todosProductos);
        const idsAsignados = promo.productos?.map((p: Producto) => p.id) || [];
        setAsignados(idsAsignados);
        setSelected(idsAsignados);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        alert("No se pudieron cargar los productos o la promoción.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await promocionService.asignarProductos(Number(id), { productos: selected });
      alert("✅ Productos asignados correctamente a la promoción.");
      navigate(`/promociones/${id}`);
    } catch (error) {
      console.error("❌ Error al asignar productos:", error);
      alert("Ocurrió un error al asignar los productos. Verifica el servidor.");
    }
  };

  if (loading) return <div className="categoria-loader">Cargando datos...</div>;

  return (
    <div className="promocion-asignar-container">
      <h2 className="promocion-title">Asignar Productos a la Promoción</h2>

      <div className="promocion-search">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit} className="promocion-asignar-form">
        <table className="promocion-productos-table">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No se encontraron productos activos.
                </td>
              </tr>
            ) : (
              filteredProductos.map((producto) => (
                <tr
                  key={producto.id}
                  className={selected.includes(producto.id) ? "producto-seleccionado" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(producto.id)}
                      onChange={() => toggleSelection(producto.id)}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>
                    S/{" "}
                    {Number(
                      producto.precio_final ??
                        producto.precio_original ??
                        producto.precio ??
                        0
                    ).toFixed(2)}
                  </td>
                  <td>{producto.stock}</td>
                  <td
                    className={
                      producto.estado === "activo" ? "estado-activo" : "estado-inactivo"
                    }
                  >
                    {producto.estado}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="promocion-asignar-actions">
          <button type="button" onClick={() => navigate("/promociones")}>
            ← Volver
          </button>
          <button type="submit" disabled={selected.length === 0}>
            💾 Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromocionAsignarProductos;

// src/pages/carritos/CarritoDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import carritoService from "../../services/carrito.service";
import { type Carrito } from "../../types/Carrito";
import { useToast } from "../../context/ToastContext";

const CarritoDetail: React.FC = () => {
  const { id } = useParams();
  const { push } = useToast();

  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarrito = async () => {
    try {
      if (!id) return;
      const res = await carritoService.mostrar(Number(id));
      setCarrito(res.carrito);
    } catch {
      push("❌ Error al cargar los detalles del carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, [id]);

  if (loading) return <p>Cargando carrito...</p>;
  if (!carrito) return <p>No se encontró el carrito.</p>;

  return (
    <div className="carrito-detail-container">
      <h2>Carrito #{carrito.id}</h2>
      <p>
        <strong>Usuario:</strong> {carrito.usuario?.name ?? "Invitado"} <br />
        <strong>Estado:</strong>{" "}
        <span
          className={`badge ${
            carrito.estado === "activo" ? "badge-success" : "badge-warning"
          }`}
        >
          {carrito.estado}
        </span>
      </p>

      {carrito.detalles && carrito.detalles.length > 0 ? (
        <table className="detalle-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.detalles.map((d) => (
              <tr key={d.id}>
                <td>{d.producto?.nombre ?? "Sin nombre"}</td>
                <td>{d.cantidad}</td>
                <td>S/ {d.precio_unitario.toFixed(2)}</td>
                <td>S/ {(d.cantidad * d.precio_unitario).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>El carrito está vacío.</p>
      )}

      <div className="carrito-total">
        <strong>Total:</strong> S/ {carrito.total?.toFixed(2) ?? "0.00"}
      </div>
    </div>
  );
};

export default CarritoDetail;

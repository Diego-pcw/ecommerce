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
      setLoading(true);

      // Llamada al servicio (usa mostrarCarrito en tu servicio)
      const res = await carritoService.mostrarCarrito(Number(id));

      // Backend retorna { carrito, total, esta_vacio }
      const fetched = res?.carrito ?? null;
      setCarrito(fetched);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      push("❌ Error al cargar los detalles del carrito", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p>Cargando carrito...</p>;
  if (!carrito) return <p>No se encontró el carrito.</p>;

  // Helper: parse safe number
  const toNumber = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const total =
    carrito.detalles?.reduce(
      (acc, d) => acc + toNumber(d.cantidad) * toNumber(d.precio_unitario),
      0
    ) ?? 0;

  // Decide qué mostrar como "usuario"
  const usuarioLabel = carrito.usuario?.name
    ? carrito.usuario.name
    : carrito.user_id
    ? `Usuario #${carrito.user_id}`
    : carrito.session_id
    ? `Invitado (${carrito.session_id.slice(0, 8)}...)`
    : "Invitado";

  return (
    <div className="carrito-detail-container">
      <h2>Carrito #{carrito.id}</h2>

      <p>
        <strong>Usuario:</strong> {usuarioLabel}
        <br />
        <strong>Estado:</strong>{" "}
        <span
          className={`badge ${
            carrito.estado === "activo"
              ? "badge-success"
              : carrito.estado === "fusionado"
              ? "badge-info"
              : "badge-warning"
          }`}
        >
          {carrito.estado}
        </span>
        {carrito.expires_at && (
          <>
            {" "}
            •{" "}
            <small>
              expira:{" "}
              {new Date(carrito.expires_at).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </small>
          </>
        )}
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
            {carrito.detalles.map((d) => {
              const precioUnit = toNumber(d.precio_unitario);
              const cantidad = toNumber(d.cantidad);
              const subtotal = precioUnit * cantidad;

              return (
                <tr key={d.id}>
                  <td>{d.producto?.nombre ?? "Sin nombre"}</td>
                  <td>{cantidad}</td>
                  <td>S/ {precioUnit.toFixed(2)}</td>
                  <td>S/ {subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>El carrito está vacío.</p>
      )}

      <div className="carrito-total" style={{ marginTop: 12 }}>
        <strong>Total:</strong> S/ {total.toFixed(2)}
      </div>
    </div>
  );
};

export default CarritoDetail;

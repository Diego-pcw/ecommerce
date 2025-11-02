// -----------------------------------------------------------------------------
// src/pages/carrito/CarritoUserView.tsx
// -----------------------------------------------------------------------------
import React from "react";
import { useCarritoContext } from "../../context/CarritoContext";
import CarritoItem from "../../components/carrito/CarritoItem";
import CarritoTotal from "../../components/carrito/CarritoTotal";

const CarritoUserView: React.FC = () => {
  const { carrito, detalles, loading } = useCarritoContext();

  if (loading) return <p>Cargando carrito...</p>;
  if (!carrito || detalles.length === 0) {
    return (
      <div className="carrito-empty">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde la tienda para comenzar.</p>
        <a href="/" className="btn btn-primary">Seguir comprando</a>
      </div>
    );
  }

  return (
    <div className="carrito-view-container">
      <h2>Mi Carrito</h2>

      <div className="carrito-grid">
        <div className="carrito-items">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d) => (
                <CarritoItem key={d.id} detalle={d} />
              ))}
            </tbody>
          </table>
        </div>

        <aside className="carrito-summary">
          <CarritoTotal />
        </aside>
      </div>
    </div>
  );
};

export default CarritoUserView;



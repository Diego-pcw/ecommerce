// -----------------------------------------------------------------------------
// src/components/carrito/CarritoTotal.tsx
// -----------------------------------------------------------------------------
import React from "react";
import { useCarritoContext } from "../../context/CarritoContext";

const CarritoTotal: React.FC = () => {
  const { calcularTotal, vaciarCarrito, carrito } = useCarritoContext();
  const total = calcularTotal();

  return (
    <div className="carrito-total-card">
      <h3>Resumen</h3>
      <div className="line-item">
        <span>Subtotal</span>
        <strong>S/ {total.toFixed(2)}</strong>
      </div>

      {/* Puedes añadir impuestos / envíos aquí */}

      <div className="actions">
        <a href="/carrito/checkout" className="btn btn-primary w-full">
          Ir a pagar
        </a>
        <button className="btn btn-outline w-full mt-2" onClick={vaciarCarrito}>
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};

export default CarritoTotal;
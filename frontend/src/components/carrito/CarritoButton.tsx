// -----------------------------------------------------------------------------
// src/components/carrito/CarritoButton.tsx
// -----------------------------------------------------------------------------
import React from "react";
import { useCarritoContext } from "../../context/CarritoContext";

const CarritoButton: React.FC = () => {
  const { detalles } = useCarritoContext();
  const cantidadTotal = detalles.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <a href="/carrito" className="carrito-button">
      <span className="icon">🛒</span>
      <span className="count">{cantidadTotal}</span>
    </a>
  );
};

export default CarritoButton;
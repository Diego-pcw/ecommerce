// -----------------------------------------------------------------------------
// src/pages/carrito/CarritoVacio.tsx
// -----------------------------------------------------------------------------
import React from "react";

const CarritoVacio: React.FC = () => {
  return (
    <div className="carrito-vacio text-center">
      <h2>Tu carrito está vacío</h2>
      <p>Explora nuestros productos y agrega lo que te guste.</p>
      <a href="/" className="btn btn-primary">Ir a la tienda</a>
    </div>
  );
};

export default CarritoVacio;
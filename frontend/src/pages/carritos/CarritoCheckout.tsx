// -----------------------------------------------------------------------------
// src/pages/carrito/CarritoCheckout.tsx
// -----------------------------------------------------------------------------
import React from "react";
import { useCarritoContext } from "../../context/CarritoContext";

const CarritoCheckout: React.FC = () => {
  const { calcularTotal, carrito } = useCarritoContext();
  const total = calcularTotal();

  if (!carrito || (carrito.detalles?.length ?? 0) === 0) {
    return (
      <div className="checkout-empty">
        <h2>No hay productos en el carrito</h2>
        <a href="/" className="btn btn-primary">Volver a la tienda</a>
      </div>
    );
  }

  const handleProcesarPago = () => {
    // Aquí iría la integración con la pasarela de pagos.
    // Por ahora redirigimos a una página de éxito simulada o mostramos mensaje.
    alert(`Procesando pago por S/ ${total.toFixed(2)} - (simulado)`);
    // Luego podrías vaciar el carrito o crear una orden.
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>Resumen de tu pedido:</p>
      <ul>
        {carrito.detalles?.map((d) => (
          <li key={d.id}>
            {d.producto?.nombre} x {d.cantidad} — S/ {(d.cantidad * d.precio_unitario).toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="checkout-total">
        <strong>Total: S/ {total.toFixed(2)}</strong>
      </div>

      <button className="btn btn-success" onClick={handleProcesarPago}>
        Pagar ahora
      </button>
    </div>
  );
};

export default CarritoCheckout;
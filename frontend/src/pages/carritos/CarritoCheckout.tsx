import React, { useState } from 'react'; // ✨ Corregido: añadido useState
import { useCarritoContext } from '../../context/CarritoContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { CreditCard, Loader2, ShoppingCart } from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoCheckout: React.FC = () => {
  const { calcularTotal, carrito} = useCarritoContext(); // ✨ Añadido vaciarCarrito
  const { push } = useToast();
  const total = calcularTotal();
  const [loading, setLoading] = useState(false); // Para simular pago

  if (!carrito || (carrito.detalles?.length ?? 0) === 0) {
    return (
      <div className="cart-empty-container">
        <ShoppingCart size={48} />
        <h2>No hay productos en el carrito</h2>
        <p>Añade productos para poder procesar el pago.</p>
        <a href="/" className="btn btn-primary">
          Volver a la tienda
        </a>
      </div>
    );
  }

  const handleProcesarPago = () => {
    setLoading(true);
    // Aquí iría la integración con la pasarela de pagos.
    // Simulamos una demora
    setTimeout(() => {
      push(
        `Pago por S/ ${total.toFixed(2)} procesado con éxito (simulado)`, // ✨ Mensaje mejorado
        'success'
      );
      setLoading(false);
      // Aquí deberías vaciar el carrito o crear una orden
      // vaciarCarrito(); // <--- Descomenta esto para vaciar el carrito
      // navigate('/pago/exitoso'); // <--- O redirigir a una página de éxito
    }, 2000);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <p>Resumen de tu pedido:</p>
      <ul className="checkout-summary-list">
        {carrito.detalles?.map((d) => (
          <li key={d.id}>
            <span>
              {d.producto?.nombre} (x {d.cantidad})
            </span>
            <strong>
              S/ {(d.cantidad * d.precio_unitario).toFixed(2)}
            </strong>
          </li>
        ))}
      </ul>

      <div className="checkout-total-display">
        <strong>Total: S/ {total.toFixed(2)}</strong>
      </div>

      <button
        className="btn btn-success"
        onClick={handleProcesarPago}
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <CreditCard size={18} />
        )}
        {loading ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </div>
  );
};

export default CarritoCheckout;
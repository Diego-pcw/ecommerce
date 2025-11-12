import React, { useEffect, useState } from 'react';
import { useCarritoContext } from '../../context/CarritoContext';
import { Trash2, CreditCard } from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoTotal: React.FC = () => {
  const { calcularTotal, vaciarCarrito } = useCarritoContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const total = calcularTotal();

  return (
    <div className="cart-summary-card">
      <h3>Resumen</h3>
      <div className="cart-summary-item">
        <span>Subtotal</span>
        <strong>S/ {total.toFixed(2)}</strong>
      </div>

      <div className="cart-summary-actions">
        <a href="/carrito/checkout" className="btn btn-primary">
          <CreditCard size={18} />
          Ir a pagar
        </a>
        <button className="btn btn-outline" onClick={vaciarCarrito}>
          <Trash2 size={18} />
          Vaciar carrito
        </button>
      </div>
    </div>
  );
};

export default CarritoTotal;
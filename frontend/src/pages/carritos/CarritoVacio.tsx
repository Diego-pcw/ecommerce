import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoVacio: React.FC = () => {
  return (
    <div className="cart-empty-container">
      <ShoppingCart size={48} strokeWidth={1} />
      <h2>Tu carrito está vacío</h2>
      <p>Explora nuestros productos y agrega lo que te guste.</p>
      <a href="/" className="btn btn-primary">
        Ir a la tienda
        <ArrowRight size={16} />
      </a>
    </div>
  );
};

export default CarritoVacio;
import React, { useEffect, useState } from 'react';
import { useCarritoContext } from '../../context/CarritoContext.tsx';
import { ShoppingCart } from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';
import type { CarritoDetalle } from '../../types/CarritoDetalle.ts'; // Importamos el tipo

const CarritoButton: React.FC = () => {
  const { detalles } = useCarritoContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const cantidadTotal = detalles.reduce(
    (acc: number, d: CarritoDetalle) => acc + d.cantidad,
    0
  );

  return (
    <a href="/carrito" className="header-cart-button">
      <ShoppingCart size={24} className="header-cart-icon" />
      {cantidadTotal > 0 && (
        <span className="header-cart-count">{cantidadTotal}</span>
      )}
    </a>
  );
};

export default CarritoButton;
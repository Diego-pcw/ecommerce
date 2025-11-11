import React from 'react';
import { useCarritoContext } from '../../context/CarritoContext';
import CarritoItem from '../../components/carrito/CarritoItem';
import CarritoTotal from '../../components/carrito/CarritoTotal';
import { Loader2, ShoppingCart } from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoUserView: React.FC = () => {
  const { carrito, detalles, loading } = useCarritoContext();

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando carrito...
      </div>
    );
  }

  if (!carrito || detalles.length === 0) {
    return (
      <div className="cart-empty-container">
        <ShoppingCart size={48} />
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde la tienda para comenzar.</p>
        <a href="/" className="btn btn-primary">
          Seguir comprando
        </a>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h2>Mi Carrito</h2>

      <div className="cart-grid-container">
        <div className="cart-items-column">
          <div className="admin-table-wrapper">
            {' '}
            {/* Reutilizamos el wrapper de la tabla */}{' '}
            <table className="cart-table">
              {' '}
              {/* Nueva clase para la tabla de carrito */}{' '}
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
        </div>

        <aside className="cart-summary-column">
          <CarritoTotal />
        </aside>
      </div>
    </div>
  );
};

export default CarritoUserView;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import carritoService from '../../services/carrito.service';
import { type Carrito } from '../../types/Carrito';
import { useToast } from '../../context/ToastContext';
import {
  Loader2,
  ArrowLeft,
  User,
  CheckCircle,
  Clock,
  CalendarDays,
} from 'lucide-react';
import '../../styles/carritos/carrito.shared.css';

const CarritoDetail: React.FC = () => {
  const { id } = useParams();
  const { push } = useToast();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCarrito = async () => {
    try {
      if (!id) return;
      setLoading(true);

      const res = await carritoService.mostrarCarrito(Number(id));
      const fetched = res?.carrito ?? null;
      setCarrito(fetched);
      document.title = `Carrito #${id} | Panel`;
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      push('❌ Error al cargar los detalles del carrito', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, push]); // Añadido push a las dependencias como en el original

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando carrito...
      </div>
    );
  if (!carrito)
    return <p className="admin-list-empty">No se encontró el carrito.</p>;

  // Helper: parse safe number
  const toNumber = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const total =
    carrito.detalles?.reduce(
      (acc, d) => acc + toNumber(d.cantidad) * toNumber(d.precio_unitario),
      0
    ) ?? 0;

  const usuarioLabel = carrito.usuario?.name
    ? carrito.usuario.name
    : carrito.user_id
    ? `Usuario #${carrito.user_id}`
    : carrito.session_id
    ? `Invitado (${carrito.session_id.slice(0, 8)}...)`
    : 'Invitado';

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>Carrito #{carrito.id}</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      <div className="admin-detail-box">
        <div className="admin-detail-info">
          <p>
            <User size={16} />
            <strong>Usuario:</strong> {usuarioLabel}
          </p>
          <p>
            <CheckCircle size={16} />
            <strong>Estado:</strong>{' '}
            <span
              className={`status-badge ${
                carrito.estado ? carrito.estado.toLowerCase() : 'desconocido'
              }`}
            >
              {carrito.estado}
            </span>
          </p>
          {carrito.expires_at && (
            <p>
              <Clock size={16} />
              <strong>Expira:</strong>{' '}
              <small>
                {new Date(carrito.expires_at).toLocaleString('es-PE', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </small>
            </p>
          )}
          <p>
            <CalendarDays size={16} />
            <strong>Actualizado:</strong>{' '}
            <small>
              {new Date(carrito.updated_at ?? '').toLocaleString('es-PE', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </small>
          </p>
        </div>

        {carrito.detalles && carrito.detalles.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carrito.detalles.map((d) => {
                  const precioUnit = toNumber(d.precio_unitario);
                  const cantidad = toNumber(d.cantidad);
                  const subtotal = precioUnit * cantidad;

                  return (
                    <tr key={d.id}>
                      <td>{d.producto?.nombre ?? 'Sin nombre'}</td>
                      <td>{cantidad}</td>
                      <td>S/ {precioUnit.toFixed(2)}</td>
                      <td>S/ {subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-list-empty">El carrito está vacío.</p>
        )}

        <div className="cart-total-display">
          <strong>Total:</strong> S/ {total.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CarritoDetail;
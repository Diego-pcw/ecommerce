import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../../services/producto.service'; // Corregido
import type { ProductoListItem } from '../../../types/Producto';
import ProductoCard from '../../../components/productos/ProductoCard'; // Corregido
import { useToast } from '../../../context/ToastContext'; // Corregido
import { Loader2, Tag, ArrowLeft } from 'lucide-react';
import '../../../styles/admin/admin.shared.css'; // Ruta ya era correcta

const ProductosOfertas: React.FC = () => {
  const [productos, setProductos] = useState<ProductoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    document.title = 'Productos en Oferta | Panel';
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        const data = await productoService.obtenerConOfertas();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos con ofertas:', err);
        const errorMsg = 'No se pudieron cargar las ofertas ❌';
        setError(errorMsg);
        push(errorMsg, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, [push]);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando productos en oferta...
      </div>
    );

  if (error) return <p className="admin-list-empty">{error}</p>;

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">
          <Tag size={24} />
          Productos con Ofertas Activas
        </h2>
        <button
          onClick={() => navigate('/productos')}
          className="btn btn-outline" // ✨
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="admin-list-empty">
          No hay productos con promociones activas.
        </p>
      ) : (
        <ul className="admin-list">
          {' '}
          {/* ✨ Usamos la lista de productos */}{' '}
          {productos.map((prod) => (
            <li key={prod.id}>
              {/*
                ✨ Renderizamos ProductoCard directamente.
                Este componente ya muestra el descuento y los precios.
                Hemos eliminado los <p> redundantes.
              */}
              <ProductoCard producto={prod} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductosOfertas;
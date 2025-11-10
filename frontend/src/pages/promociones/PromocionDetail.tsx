import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { promocionService } from '../../services/promocion.service';
import type { Promocion } from '../../types/Promocion';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Tag,
  Percent,
  CircleDollarSign,
  CalendarDays,
  CheckCircle,
  FileText,
  Loader2,
  Package,
} from 'lucide-react';
import '../../styles/promociones/promocion.shared.css';

const PromocionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromocion = async () => {
      if (!id || isNaN(Number(id))) {
        push('ID de promoción inválido.', 'error');
        setLoading(false);
        navigate('/promociones');
        return;
      }

      try {
        setLoading(true);
        const data = await promocionService.obtener(Number(id));
        setPromocion(data);
        document.title = `Detalle: ${data.titulo} | Panel`;
      } catch (error) {
        console.error('❌ Error al obtener promoción:', error);
        push('No se pudo cargar la promoción.', 'error');
        navigate('/promociones');
      } finally {
        setLoading(false);
      }
    };

    fetchPromocion();
  }, [id, push, navigate]);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando promoción...
      </div>
    );

  if (!promocion)
    return <p className="admin-list-empty">No se encontró la promoción.</p>;

  // Función helper para formatear fechas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>🎯 Detalle de Promoción</h2>
        <div className="admin-detail-actions">
          <Link to="/promociones" className="btn btn-outline">
            <ArrowLeft size={16} />
            Volver
          </Link>
        </div>
      </div>

      <div className="admin-detail-box">
        <div className="admin-detail-item">
          <strong>
            <Tag size={14} /> Título
          </strong>
          <span>{promocion.titulo}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <CheckCircle size={14} /> Estado
          </strong>
          <span className={`status-badge ${promocion.estado?.toLowerCase()}`}>
            {promocion.estado}
          </span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <Percent size={14} /> Tipo de Descuento
          </strong>
          <span>
            {promocion.descuento_tipo === 'percent'
              ? 'Porcentaje'
              : 'Monto fijo'}
          </span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <CircleDollarSign size={14} /> Valor del Descuento
          </strong>
          <span>
            {promocion.descuento_tipo === 'percent'
              ? `${promocion.descuento_valor}%`
              : `S/ ${Number(promocion.descuento_valor).toFixed(2)}`}
          </span>
        </div>

        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Fecha Inicio
          </strong>
          <span>{formatDate(promocion.fecha_inicio)}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Fecha Fin
          </strong>
          <span>{formatDate(promocion.fecha_fin)}</span>
        </div>
        
        <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
          <strong>
            <FileText size={14} /> Descripción
          </strong>
          <span>{promocion.descripcion || 'Sin descripción disponible.'}</span>
        </div>

        <div className="admin-detail-item" style={{ gridColumn: '1 / -1' }}>
          <strong>
            <Package size={14} /> Productos en Promoción (
            {promocion.productos?.length || 0})
          </strong>
          {promocion.productos && promocion.productos.length > 0 ? (
            <ul className="detail-product-list">
              {promocion.productos.map((prod) => (
                <li key={prod.id}>
                  <strong>{prod.nombre}</strong> — S/
                  {Number(prod.precio ?? 0).toFixed(2)}
                  {prod.precio_con_descuento && (
                    <span className="discount-price">
                      (S/ {Number(prod.precio_con_descuento).toFixed(2)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <span>No hay productos asignados.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromocionDetail;
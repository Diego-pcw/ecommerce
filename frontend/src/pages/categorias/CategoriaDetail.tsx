import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriaService } from '../../services/categoria.service';
import type { Categoria } from '../../types/Categoria';
import { useToast } from '../../context/ToastContext';

// ✨ 1. Importamos iconos y los estilos compartidos
import {
  ArrowLeft,
  Edit2,
  Hash,
  Type,
  FileText,
  CheckCircle,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import '../../styles/categorias/categorias.shared.css'; // Reemplaza el .module.css

const CategoriaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoria = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await categoriaService.obtenerPorId(Number(id));
      setCategoria(data);
    } catch (error) {
      console.error(error);
      push('Error al cargar la categoría.', 'error');
      navigate('/categorias'); // Redirigimos si hay error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoria) {
      document.title = `Detalle: ${categoria.nombre} | Panel`;
    }
    fetchCategoria();
  }, [id, push, navigate]); // Dependencias originales

  // ✨ 2. Aplicamos el loader-container
  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando detalle...
      </div>
    );

  // ✨ 3. Aplicamos el admin-list-empty
  if (!categoria)
    return <p className="admin-list-empty">No se encontró la categoría.</p>;

  // Función helper para formatear fechas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('es-PE', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  // ✨ 4. Aplicamos todas las clases de CSS del shared.css
  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2>Detalle de Categoría</h2>
        <div className="admin-detail-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/categorias')}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
          >
            <Edit2 size={16} />
            Editar
          </button>
        </div>
      </div>

      {/* ✨ 5. Estructura de "admin-detail-box" con items */}
      <div className="admin-detail-box">
        <div className="admin-detail-item">
          <strong>
            <Hash size={14} /> ID
          </strong>
          <span>{categoria.id}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <Type size={14} /> Nombre
          </strong>
          <span>{categoria.nombre}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <FileText size={14} /> Descripción
          </strong>
          <span>{categoria.descripcion || 'Sin descripción.'}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <CheckCircle size={14} /> Estado
          </strong>
          {/* ✨ 6. Aplicamos el status-badge */}
          <span className={`status-badge ${categoria.estado}`}>
            {categoria.estado}
          </span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Fecha de creación
          </strong>
          <span>{formatDate(categoria.created_at)}</span>
        </div>
        <div className="admin-detail-item">
          <strong>
            <CalendarDays size={14} /> Última actualización
          </strong>
          <span>{formatDate(categoria.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriaDetail;
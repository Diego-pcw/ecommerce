import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagenProductoService } from '../../services/imagenproducto.service.ts';
import type { ImagenProducto } from '../../types/ImagenProducto.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Plus, Eye, Edit2, Trash2, Loader2, ImageOff } from 'lucide-react';
import '../../styles/imagenes/imagen.shared.css';

const ImagenesIndex: React.FC = () => {
  const [imagenes, setImagenes] = useState<ImagenProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const navigate = useNavigate();

  // 🔹 Cargar todas las imágenes
  useEffect(() => {
    document.title = 'Imágenes | Panel de Administración';
    const fetchImagenes = async () => {
      try {
        const res = await imagenProductoService.obtenerTodas();
        // 🧠 Aseguramos que siempre sea un array
        setImagenes(res.data);
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        push('❌ Error al cargar las imágenes desde el servidor.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchImagenes();
  }, [push]);

  // 🔹 Eliminar imagen
  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta imagen?')) return; // Mantenemos confirm por ahora

    try {
      await imagenProductoService.eliminar(id);
      setImagenes((prev) => prev.filter((img) => img.id !== id));
      push('🗑️ Imagen eliminada correctamente.', 'success');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      push('❌ No se pudo eliminar la imagen.', 'error');
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando imágenes...
      </div>
    );

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2 className="admin-list-title">📸 Imágenes de Productos</h2>
        <button
          onClick={() => navigate('/imagenes/crear')}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Nueva Imagen
        </button>
      </div>

      {imagenes.length === 0 ? (
        <p className="admin-list-empty">
          <ImageOff size={40} />
          No hay imágenes registradas.
        </p>
      ) : (
        <div className="image-grid">
          {imagenes.map((img) => (
            <div key={img.id} className="image-card">
              <img
                src={img.url}
                alt={img.alt_text ?? 'Sin descripción'}
                className="image-card-img"
                onError={(e) =>
                  (e.currentTarget.src =
                    'https://placehold.co/300x200/f3f4f6/9ca3af?text=Error')
                }
              />
              <div className="image-card-info">
                <p className="image-card-alt">
                  {img.alt_text || <i>Sin texto alternativo</i>}
                </p>
                <span
                  className={`status-badge ${
                    img.estado?.toLowerCase() === 'activo' ? 'activo' : 'inactivo'
                  }`}
                >
                  {img.estado?.toLowerCase() ?? 'inactivo'}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="admin-card-actions">
                <button
                  onClick={() => navigate(`/imagenes/${img.id}`)}
                  className="btn btn-secondary"
                  title="Ver"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => navigate(`/imagenes/editar/${img.id}`)}
                  className="btn btn-outline"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleEliminar(img.id)}
                  className="btn btn-danger"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagenesIndex;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagenProductoService } from '../../services/imagenproducto.service.ts';
import type { ImagenProductoPorProductoResponse } from '../../types/ImagenProducto.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Loader2, Image, Images, ArrowLeft } from 'lucide-react';
import '../../styles/imagenes/imagen.shared.css';

const ImagenesShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imagenes, setImagenes] =
    useState<ImagenProductoPorProductoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await imagenProductoService.obtenerPorProducto(Number(id));
        setImagenes(res);
        document.title = `Imágenes de Producto #${id} | Panel`;
      } catch (err) {
        console.error('Error al obtener imágenes por producto:', err);
        push('❌ Error al cargar las imágenes.', 'error');
        navigate('/imagenes'); // Volver si hay error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, push, navigate]);

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando imágenes...
      </div>
    );

  if (!imagenes)
    return (
      <p className="admin-list-empty">
        No se encontraron imágenes para este producto.
      </p>
    );

  return (
    <div className="admin-detail-container">
      <div className="admin-detail-header">
        <h2 className="admin-list-title">
          📦 Imágenes del Producto #{imagenes.producto_id}
        </h2>
        <div className="admin-detail-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate('/imagenes')}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      <div className="image-detail-gallery">
        {imagenes.principal && (
          <div className="mb-6">
            <h3>
              <Image size={20} /> Imagen Principal
            </h3>
            <img
              src={imagenes.principal.url}
              alt={imagenes.principal.alt_text ?? ''}
              className="image-detail-main"
              onError={(e) =>
                (e.currentTarget.src =
                  'https://placehold.co/600x400/f3f4f6/9ca3af?text=Error')
              }
            />
          </div>
        )}

        {imagenes.secundarias.length > 0 ? (
          <div>
            <h3>
              <Images size={20} /> Otras Imágenes
            </h3>
            <div className="image-detail-grid">
              {imagenes.secundarias.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt_text ?? ''}
                  onError={(e) =>
                    (e.currentTarget.src =
                      'https://placehold.co/150x100/f3f4f6/9ca3af?text=Error')
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <p>No hay imágenes secundarias registradas.</p>
        )}
      </div>
    </div>
  );
};

export default ImagenesShow;
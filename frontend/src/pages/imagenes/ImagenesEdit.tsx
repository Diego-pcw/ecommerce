import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imagenProductoService } from '../../services/imagenproducto.service';
import type {
  ImagenProducto,
  ImagenProductoUpdateData,
} from '../../types/ImagenProducto';
import { useToast } from '../../context/ToastContext';
import { Save, X, Loader2, UploadCloud, ImageOff } from 'lucide-react'; // ✨ Agregué ImageOff
import '../../styles/imagenes/imagen.shared.css';

const ImagenesEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();

  const [imagen, setImagen] = useState<ImagenProducto | null>(null);
  const [nuevoArchivo, setNuevoArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // ✨ Preview para nuevo archivo
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✨ Estado de guardado

  // 🔹 Cargar datos iniciales (mantenemos tu lógica original)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const token = localStorage.getItem('token');
        if (!token) {
          push('Acceso denegado. Debes iniciar sesión.', 'error');
          return;
        }

        const res = await imagenProductoService.obtenerTodas();
        const imagenEncontrada = res.data.find((img) => img.id === Number(id));

        if (imagenEncontrada) {
          setImagen(imagenEncontrada);
          document.title = `Editar Imagen #${id} | Panel`;
        } else {
          push('Imagen no encontrada ❌', 'error');
        }
      } catch (err) {
        console.error('Error al obtener la imagen:', err);
        push('Error al cargar los datos ❌', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, push]);

  // 🔹 Manejador de nuevo archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNuevoArchivo(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setNuevoArchivo(null);
      setPreview(null);
    }
  };

  // 🔹 Enviar actualización
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen || !id) return;

    setSaving(true); // ✨
    const data: ImagenProductoUpdateData = {
      imagen: nuevoArchivo ?? undefined,
      alt_text: imagen.alt_text,
      estado: 'activo', // Tu lógica original
    };

    try {
      const res = await imagenProductoService.actualizar(Number(id), data);
      push(res.message || 'Imagen actualizada correctamente ✅', 'success');
      setTimeout(() => navigate('/imagenes'), 1500); // ✨ Reducido a 1.5s
    } catch (err) {
      console.error(err);
      push('Error al actualizar la imagen ❌', 'error');
    } finally {
      setSaving(false); // ✨
    }
  };

  if (loading)
    return (
      <div className="loader-container">
        <Loader2 className="animate-spin" size={32} />
        Cargando imagen...
      </div>
    );

  if (!imagen)
    return (
      <p className="admin-list-empty">
        <ImageOff size={40} />
        Imagen no disponible.
      </p>
    );

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">✏️ Editar Imagen #{imagen.id}</h2>

      <div
        className="image-preview"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <label>Imagen Actual</label>
        <img
          src={preview || imagen.url} // ✨ Muestra el preview si existe
          alt={imagen.alt_text ?? 'Imagen actual'}
          style={{ height: '150px', width: 'auto' }}
          onError={(e) =>
            (e.currentTarget.src =
              'https://placehold.co/300x150/f3f4f6/9ca3af?text=Error')
          }
        />
        {preview && <span>(Nueva imagen seleccionada)</span>}
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>📷 Reemplazar imagen (Opcional)</label>
          <label htmlFor="imagen-file-input" className="admin-form-file-label">
            <UploadCloud size={18} />
            <span>
              {nuevoArchivo
                ? nuevoArchivo.name
                : 'Seleccionar nuevo archivo...'}
            </span>
            <input
              id="imagen-file-input"
              type="file"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="admin-form-group">
          <label htmlFor="alt_text">📝 Texto alternativo</label>
          <input
            id="alt_text"
            type="text"
            placeholder="Descripción o texto alternativo"
            value={imagen.alt_text ?? ''}
            onChange={(e) => setImagen({ ...imagen, alt_text: e.target.value })}
          />
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/imagenes')}
            disabled={saving}
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImagenesEdit;
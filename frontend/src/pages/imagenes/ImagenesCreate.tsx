import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagenProductoService } from '../../services/imagenproducto.service.ts';
import type { ImagenProductoCreateData } from '../../types/ImagenProducto.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Save, X, Loader2, UploadCloud, Image } from 'lucide-react';
import '../../styles/imagenes/imagen.shared.css';

const ImagenesCreate: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ImagenProductoCreateData>>({
    producto_id: undefined,
    alt_text: '',
    principal: false,
    orden: 1,
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✨ Para el submit
  const { push } = useToast();
  const navigate = useNavigate();

  // 🔹 Manejadores
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagenFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImagenFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagenFile || !formData.producto_id) {
      push('Debes seleccionar un producto y una imagen', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload: ImagenProductoCreateData = {
        producto_id: Number(formData.producto_id),
        imagen: imagenFile,
        alt_text: formData.alt_text ?? '',
        principal: formData.principal ?? false,
        orden: Number(formData.orden) || 1,
      };

      const res = await imagenProductoService.crear(payload);
      push(res.message || 'Imagen subida correctamente ✅', 'success');

      // 🔸 Reiniciar formulario (tu lógica original)
      setFormData({
        producto_id: undefined,
        alt_text: '',
        principal: false,
        orden: 1,
      });
      setImagenFile(null);
      setPreview(null);
      (document.getElementById('imagen-file-input') as HTMLInputElement).value =
        ''; // Limpiar el input file

      setTimeout(() => navigate('/imagenes'), 1200);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      push('❌ Error al subir la imagen', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2 className="admin-form-title">🖼️ Nueva Imagen</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className="image-preview"
          />
        ) : (
          <div
            className="image-preview"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Image size={40} />
            <span>Vista previa de la imagen</span>
          </div>
        )}

        <div className="admin-form-group">
          <label htmlFor="producto_id">ID del Producto</label>
          <input
            id="producto_id"
            type="number"
            name="producto_id"
            placeholder="ID del Producto (obligatorio)"
            value={formData.producto_id ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Archivo de Imagen</label>
          <label htmlFor="imagen-file-input" className="admin-form-file-label">
            <UploadCloud size={18} />
            <span>
              {imagenFile ? imagenFile.name : 'Seleccionar archivo...'}
            </span>
            <input
              id="imagen-file-input"
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </label>
        </div>

        <div className="admin-form-group">
          <label htmlFor="alt_text">Texto alternativo (Alt)</label>
          <input
            id="alt_text"
            type="text"
            name="alt_text"
            placeholder="Descripción breve de la imagen"
            value={formData.alt_text ?? ''}
            onChange={handleChange}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="orden">Orden</label>
          <input
            id="orden"
            type="number"
            name="orden"
            placeholder="Orden de visualización (ej. 1, 2, 3...)"
            value={formData.orden ?? ''}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="admin-form-checkbox">
          <input
            id="principal"
            type="checkbox"
            name="principal"
            checked={formData.principal ?? false}
            onChange={handleChange}
          />
          <label htmlFor="principal">¿Es la imagen principal del producto?</label>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/imagenes')}
            disabled={loading}
          >
            <X size={18} />
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Subiendo...' : 'Subir Imagen'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImagenesCreate;
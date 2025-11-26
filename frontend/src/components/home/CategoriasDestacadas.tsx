import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriaService } from '../../services/categoria.service';
import type { Categoria } from '../../types/Categoria';
import {
  Loader2,
  ShoppingBag,
  Wrench,
  Shield,
  Zap,
  Droplet,
  Disc,
  Component,
  HardHat,
} from 'lucide-react';
import '../../styles/categorias/categoriasdestac.shared.css';

const CategoriasDestacadas: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Cargar categorías reales del backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        
        const res = await categoriaService.obtenerTodas();
        // Si la respuesta es paginada (data.data) o array directo, lo manejamos
        const data = Array.isArray(res) ? res : res.data || [];
        
        // Tomamos solo las primeras 8 para no saturar el home y filtramos por activas
        const activas = data.filter((c: Categoria) => c.estado === 'activo').slice(0, 8);
        
        setCategorias(activas);
      } catch (error) {
        console.error('Error al cargar categorías destacadas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // 🔹 Función inteligente para asignar iconos según el nombre
  const getIconByCategory = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('casco')) return <HardHat />;
    if (n.includes('llanta') || n.includes('neumatico') || n.includes('rueda')) return <Disc />;
    if (n.includes('aceite') || n.includes('lubricante') || n.includes('quimico')) return <Droplet />;
    if (n.includes('electrico') || n.includes('bateria') || n.includes('luz')) return <Zap />;
    if (n.includes('seguridad') || n.includes('guante') || n.includes('casaca')) return <Shield />;
    if (n.includes('herramienta') || n.includes('llave')) return <Wrench />;
    if (n.includes('repuesto') || n.includes('motor')) return <Component />;
    
    return <ShoppingBag />; // Icono por defecto
  };

  // 🔹 Navegar al catálogo filtrado
  const handleCategoryClick = (id: number) => {
    // Redirige al catálogo filtrando por el ID de la categoría
    navigate(`/catalogo?categoria_id=${id}`);
  };

  if (loading) {
    return (
      <div className="categories-loader">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (categorias.length === 0) return null; // No mostrar sección si no hay datos

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">
            Explora por <span>Categoría</span>
          </h2>
          <p className="categories-subtitle">
            Encuentra rápidamente lo que necesitas navegando por nuestras categorías principales.
          </p>
        </div>

        <div className="categories-grid">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="category-card-featured"
              onClick={() => handleCategoryClick(cat.id)}
              role="button"
              tabIndex={0}
              aria-label={`Ver productos de ${cat.nombre}`}
            >
              <div className="cat-icon-wrapper">
                {getIconByCategory(cat.nombre)}
              </div>
              <div className="cat-info">
                <h3 className="cat-name">{cat.nombre}</h3>
                <p className="cat-desc">
                  {cat.descripcion || 'Ver todos los productos disponibles'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriasDestacadas;
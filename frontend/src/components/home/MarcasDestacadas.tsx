import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../../services/producto.service';
import '../../styles/productos/marcas.shared.css';

interface MarcaItem {
  nombre: string;
  logo: string;
}

const MarcasDestacadas: React.FC = () => {
  const navigate = useNavigate();
  const [marcas, setMarcas] = useState<MarcaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Cargar marcas reales desde los productos
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const res = await productoService.obtenerTodos({
          page: 1,
          per_page: 200,
          estado: 'activo',
        });

        const productos = res.data || [];

        // Extraer marcas únicas
        const brandMap = new Map<string, MarcaItem>();

        productos.forEach((p: any) => {
          if (!p.marca) return;

          // Logo placeholder con color dinámico según hash
          const color = stringToColor(p.marca);

          brandMap.set(p.marca, {
            nombre: p.marca,
            logo: `https://placehold.co/120x60/ffffff/${color}?text=${encodeURIComponent(
              p.marca
            )}&font=montserrat`,
          });
        });

        setMarcas(Array.from(brandMap.values()));
      } catch (error) {
        console.error('Error cargando marcas', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  // 🔹 Función hash simple para colores consistentes
  const stringToColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = ((hash >> 24) & 0xff)
      .toString(16)
      .padStart(2, '0')
      .slice(0, 6);

    return color.replace('-', '').substring(0, 6) || '333333';
  };

  // 🔹 Ir al catálogo filtrando por marca
  const handleMarcaClick = (marcaNombre: string) => {
    navigate(`/catalogo?search=${encodeURIComponent(marcaNombre)}`);
  };

  return (
    <section className="marcas-section">
      <div className="marcas-container">
        <div className="marcas-header">
          <h2 className="marcas-title">
            Marcas <span>Destacadas</span>
          </h2>
          <p className="marcas-subtitle">
            Trabajamos con las mejores marcas del mercado para garantizar
            calidad, durabilidad y rendimiento.
          </p>
        </div>

        {/* Loader inicial */}
        {isLoading ? (
          <p className="marcas-loading">Cargando marcas...</p>
        ) : (
          <div className="marcas-grid">
            {marcas.map((marca) => (
              <div
                key={marca.nombre}
                className="marca-card"
                onClick={() => handleMarcaClick(marca.nombre)}
                role="button"
                aria-label={`Ver productos de ${marca.nombre}`}
                title={`Ver productos de ${marca.nombre}`}
              >
                <img
                  src={marca.logo}
                  alt={`Logo de ${marca.nombre}`}
                  className="marca-logo"
                  loading="lazy"
                />
                <span className="marca-name">{marca.nombre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MarcasDestacadas;

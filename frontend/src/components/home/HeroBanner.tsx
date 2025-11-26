import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.shared.css';
import { ArrowRight, Tag } from 'lucide-react';

const HeroBanner: React.FC = () => {
  return (
    <section className="hero-banner">

      <div className="hero-content">

        <span className="hero-promo-badge">🔥 Nueva Colección 2025</span>

        <h1 className="hero-title">
          Equipa Tu Aventura <span>Sobre Ruedas</span>
        </h1>

        <p className="hero-subtitle">
          Accesorios de calidad profesional, cascos certificados, repuestos premium y equipamiento diseñado
          para acompañarte en cada ruta. Te llevamos más lejos.
        </p>

        <div className="hero-actions">
          <Link to="/catalogo" className="btn btn-primary">
            <ArrowRight size={18} />
            Ver Catálogo
          </Link>

          <Link to="/promociones" className="btn btn-outline">
            <Tag size={18} />
            Promociones de Temporada
          </Link>
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;

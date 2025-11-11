import React from "react";
import { Link } from "react-router-dom";
import "@/styles/home.shared.css";

const HeroBanner: React.FC = () => {
  return (
    <section className="hero-banner">
      <div className="hero-content animate-fadeIn">
        <h1 className="hero-title">
          Bienvenido a <span>Mi Tienda</span>
        </h1>
        <p className="hero-subtitle">
          Encuentra lo mejor en herramientas, materiales y productos de calidad.
        </p>

        <div className="hero-actions">
          <Link to="/catalogo" className="btn-home-primary">
            🛒 Ver Catálogo
          </Link>
          <Link to="/admin/dashboard" className="btn-home-secondary">
            💥 Promociones
          </Link>
          <Link to="/contacto/mis-mensajes" className="btn-home-secondary">
            💥 Contacto
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.shared.css";

const UserHome: React.FC = () => {
  return (
    <section className="home-section">
      <div className="home-content">
        <h1 className="home-title">
          Bienvenido a <span>Mi Tienda</span>
        </h1>
        <p className="home-subtitle">
          Encuentra lo mejor en herramientas, materiales y productos de calidad.
        </p>

        <div className="home-actions">
          <Link to="/productos" className="btn-home-primary">
            Ver productos
          </Link>
          <Link to="/categorias" className="btn-home-secondary">
            Explorar categorías
          </Link>
          <Link to="/imagenes" className="btn-home-secondary">
            Explorar Imagenes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UserHome;

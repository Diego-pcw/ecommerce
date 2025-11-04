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
          {/* 🛍️ Productos y categorías */}
          <Link to="/productos" className="btn-home-primary">
            Ver productos
          </Link>
          <Link to="/categorias" className="btn-home-secondary">
            Explorar categorías
          </Link>
          <Link to="/imagenes" className="btn-home-secondary">
            Explorar imágenes
          </Link>
          <Link to="/promociones" className="btn-home-secondary">
            Explorar promociones
          </Link>

          {/* 👥 Administración */}
          <Link to="/admin/usuarios" className="btn-home-secondary">
            Gestión de usuarios
          </Link>

          {/* 🗣️ Reseñas */}
          <Link to="/resenas" className="btn-home-secondary">
            Ver todas las reseñas
          </Link>
          <Link to="/resenas-public" className="btn-home-secondary">
            Ver reseñas de productos
          </Link>

          {/* 💬 Contacto (cliente) */}
          <Link to="/contacto" className="btn-home-secondary">
            Enviar mensaje de contacto
          </Link>
          <Link to="/contacto/mis-mensajes" className="btn-home-secondary">
            Mis mensajes enviados
          </Link>

          {/* 👨‍💼 Contactos (vista admin) */}
          <Link to="/admin/contactos" className="btn-home-secondary">
            Mensajes de contacto (admin)
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UserHome;

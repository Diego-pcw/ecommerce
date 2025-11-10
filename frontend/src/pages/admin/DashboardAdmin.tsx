import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.shared.css"; // reutilizamos estilos existentes

const DashboardAdmin: React.FC = () => {
  return (
    <section className="home-section">
      <div className="home-content max-w-5xl mx-auto">
        <h1 className="home-title text-center">
          Panel de <span>Administración</span>
        </h1>
        <p className="home-subtitle text-center mb-8">
          Gestiona usuarios, productos, categorías, promociones y más desde un
          solo lugar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 home-actions">
          {/* 🧾 Gestión principal */}
        <Link to="/admin/productos" className="btn-home-primary">
            🛍️ Productos y Ofertas
        </Link>
        <Link to="/productos" className="btn-home-secondary">
                Ver productos
        </Link>
        <Link to="/categorias" className="btn-home-secondary">
            🗂️ Categorías
        </Link>
        <Link to="/imagenes" className="btn-home-secondary">
            🖼️ Imágenes
          </Link>

          {/* 🧑‍💼 Usuarios y contactos */}
          <Link to="/admin/usuarios" className="btn-home-secondary">
            👥 Usuarios
          </Link>
          <Link to="/admin/contactos" className="btn-home-secondary">
            💬 Mensajes de Contacto
          </Link>
          <Link to="/carritos" className="btn-home-secondary">
            🛒 Carritos de Clientes
          </Link>

          {/* 🏷️ Promociones */}
          <Link to="/promociones" className="btn-home-secondary">
            🎟️ Promociones Activas
          </Link>

          {/* ⭐ Reseñas */}
          <Link to="/resenas" className="btn-home-secondary">
            ⭐ Reseñas de Usuarios
          </Link>
          <Link to="/resenas-public" className="btn-home-secondary">
            🗣️ Opiniones de Productos
          </Link>

          {/* ⚙️ Opcional: configuración futura */}
          <Link to="/admin/configuracion" className="btn-home-secondary">
            ⚙️ Configuración del Sistema
          </Link>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ⬅️ Volver al inicio público
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DashboardAdmin;

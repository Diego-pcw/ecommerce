import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🏍️ <span>Mi Tienda</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/productos" className="nav-link">Productos</Link>
          <Link to="/categorias" className="nav-link">Categorías</Link>

          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                {user.name ?? user.name ?? "Perfil"}
              </Link>

              {user.rol === "admin" && (
                <Link to="/admin/dashboard" className="nav-link">Admin</Link>
              )}

              <button onClick={logout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Iniciar sesión</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

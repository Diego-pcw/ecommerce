import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.shared.css';
import CarritoButton from './carrito/CarritoButton';
import {
  Store,
  LayoutGrid,
  User,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Rocket,
} from 'lucide-react';
import Footer from "../components/Footer"
import SocialBubble from './SocialBubble';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="layout-container">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <Rocket size={28} />
            Mi Tienda <span>Biker</span>
          </Link>

          <nav className="header-nav">
            <Link to="/productos" className="header-nav-link">
              <Store size={16} />
              Productos
            </Link>
            <Link to="/categorias" className="header-nav-link">
              <LayoutGrid size={16} />
              Categorías
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="header-nav-link">
                  <User size={16} />
                  {user.name ?? (user as any).name ?? 'Perfil'}
                </Link>

                {user.rol === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="header-nav-link admin-link"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}

                <button onClick={() => logout()} className="btn-logout">
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-nav-link">
                  <LogIn size={16} />
                  Iniciar sesión
                </Link>
                <Link to="/register" className="header-nav-link">
                  <UserPlus size={16} />
                  Registrarse
                </Link>
              </>
            )}

            {/* Carrito siempre visible en el header */}
            <div style={{ marginLeft: '0.5rem' }}>
              <CarritoButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <SocialBubble>
      </SocialBubble>

      <Footer />
    </div>
  );
};

export default Layout;
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/home/layout.shared.css';
import CarritoButton from './carrito/CarritoButton';
import Footer from './Footer';
import SocialBubble from './SocialBubble';
import logo from '../assets/logo.png'; // ⚠️ Asegúrate de tener esta imagen
import {
  Store,
  LayoutGrid,
  User,
  Shield,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronRight,
  ShoppingBag,
  Home,
  Tag,
  Info,
  Phone,
  UserPlus,
} from 'lucide-react';

// Placeholder por si falla la imagen local (puedes borrar esto en producción)
const logoBiker = 'https://placehold.co/300x100/ffffff/000000?text=BIKER+WOLF&font=oswald';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="layout-container">
      
      {/* 🔹 HEADER PRINCIPAL */}
      <header className="header">
        <div className="header-content">
          
          {/* Botón Menú Móvil */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <Menu size={32} />
          </button>

          {/* Logo con Imagen */}
          <Link to="/" className="header-logo">
            <img 
              src={logo} // Usa tu imagen importada
              alt="Biker Wolf Perú" 
              className="header-logo-img"
              onError={(e) => { e.currentTarget.src = logoBiker; }} // Fallback si no encuentra logo.png
            />
          </Link>

          {/* Navegación Desktop */}
          <nav className="header-nav-desktop">
            <div className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <Home size={20} /> Inicio
              </Link>
            </div>

            {/* ✨ MEGA MENÚ (Categorías) */}
            <div className="nav-item mega-menu-trigger">
              <Link to="/categorias" className="nav-link">
                <LayoutGrid size={20} /> Categorías
              </Link>
              
              {/* Dropdown */}
              <div className="mega-menu-dropdown">
                <div className="mega-menu-categories">
                  <div className="mm-category-group">
                    <h4>Equipamiento</h4>
                    <Link to="/catalogo?search=casco" className="mm-link"><ChevronRight size={16} /> Cascos Certificados</Link>
                    <Link to="/catalogo?search=guantes" className="mm-link"><ChevronRight size={16} /> Guantes de Protección</Link>
                    <Link to="/catalogo?search=casaca" className="mm-link"><ChevronRight size={16} /> Casacas y Chalecos</Link>
                    <Link to="/catalogo?search=botas" className="mm-link"><ChevronRight size={16} /> Botas Racing</Link>
                  </div>
                  <div className="mm-category-group">
                    <h4>Repuestos</h4>
                    <Link to="/catalogo?search=aceite" className="mm-link"><ChevronRight size={16} /> Aceites y Lubricantes</Link>
                    <Link to="/catalogo?search=llanta" className="mm-link"><ChevronRight size={16} /> Llantas y Neumáticos</Link>
                    <Link to="/catalogo?search=bateria" className="mm-link"><ChevronRight size={16} /> Baterías y Eléctrico</Link>
                    <Link to="/catalogo?search=freno" className="mm-link"><ChevronRight size={16} /> Sistemas de Freno</Link>
                  </div>
                </div>
                
                {/* Promo Box dentro del menú */}
                <div className="mm-promo-box">
                  <h5 className="mm-promo-title">¡Oferta Relámpago! ⚡</h5>
                  <p className="mm-promo-desc">Llévate un kit de mantenimiento con 20% de descuento solo por hoy.</p>
                  <Link to="/promociones" className="mm-btn">Ver Promoción</Link>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <Link to="/catalogo" className={`nav-link ${location.pathname === '/catalogo' ? 'active' : ''}`}>
                <Store size={20} /> Catálogo
              </Link>
            </div>
            
            <div className="nav-item">
               <Link to="/promociones" className="nav-link" style={{color: '#e11d48'}}>
                 <Tag size={20} /> Ofertas
               </Link>
            </div>
          </nav>

          {/* Acciones Derecha (Carrito + User) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            
            <div className="nav-item">
              <CarritoButton />
            </div>

            {/* User Menu Desktop */}
            <div className="header-nav-desktop">
              {user ? (
                <>
                  <Link to="/profile" className="nav-link" title="Mi Perfil">
                    <User size={22} />
                    <span style={{fontSize: '1rem', marginLeft: '0.25rem'}}>
                      {user.name?.split(' ')[0]}
                    </span>
                  </Link>

                  {user.rol === 'admin' && (
                    <Link to="/admin/dashboard" className="nav-link admin">
                      <Shield size={20} /> Panel
                    </Link>
                  )}
                  
                  <button onClick={logout} className="nav-link" style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }} title="Salir">
                    <LogOut size={22} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-link" style={{fontWeight: 700, border: '2px solid var(--color-text-primary)', padding: '0.5rem 1.2rem'}}>
                  <LogIn size={20} /> Ingresar
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 📱 SIDEBAR MÓVIL */}
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={toggleMobileMenu}
      />
      <aside className={`mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">Menú</div>
          <button onClick={toggleMobileMenu} style={{background:'none', border:'none', cursor:'pointer', color: 'var(--color-text-primary)'}}>
            <X size={32} />
          </button>
        </div>
        
        <nav className="sidebar-content">
          <Link to="/" className="sidebar-link"><Home size={24} /> Inicio</Link>
          <Link to="/catalogo" className="sidebar-link"><ShoppingBag size={24} /> Catálogo Completo</Link>
          <Link to="/categorias" className="sidebar-link"><LayoutGrid size={24} /> Categorías</Link>
          <Link to="/promociones" className="sidebar-link" style={{color: '#e11d48'}}><Tag size={24} /> Ofertas</Link>
          <div style={{borderTop: '1px solid #eee', margin: '0.5rem 0'}} />
          <Link to="/SobreNosotros" className="sidebar-link"><Info size={24} /> Sobre Nosotros</Link>
          <Link to="/contacto" className="sidebar-link"><Phone size={24} /> Contacto</Link>
        </nav>

        <div className="sidebar-footer">
           {user ? (
             <div className="user-actions-mobile">
               <div style={{marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem'}}>👋 Hola, {user.name}</div>
               
               <Link to="/profile" className="btn btn-outline">
                 <User size={20} style={{marginRight: '8px'}} /> Mi Perfil
               </Link>
               
               {user.rol === 'admin' && (
                 <Link to="/admin/dashboard" className="btn btn-primary">
                   <Shield size={20} style={{marginRight: '8px'}} /> Panel Admin
                 </Link>
               )}
               
               <button onClick={logout} className="btn btn-danger">
                 <LogOut size={20} style={{marginRight: '8px'}} /> Cerrar Sesión
               </button>
             </div>
           ) : (
             <div className="user-actions-mobile">
               <Link to="/login" className="btn btn-primary">
                 <LogIn size={20} style={{marginRight: '8px'}} /> Iniciar Sesión
               </Link>
               <Link to="/register" className="btn btn-outline">
                 <UserPlus size={20} style={{marginRight: '8px'}} /> Registrarse
               </Link>
             </div>
           )}
        </div>
      </aside>

      {/* 🖼️ CONTENIDO PRINCIPAL */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* 🧩 COMPONENTES FLOTANTES Y FOOTER */}
      <SocialBubble />
      <Footer />
    </div>
  );
};

export default Layout;